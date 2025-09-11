function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const LABEL_WIDTH = 14;
const LABEL_WIDTH_TWO_COL = 10;
const TWO_COL_TOTAL = 36;

function linha(label, valor, largura = LABEL_WIDTH) {
    const rotulo = (label + ':').padEnd(largura, ' ');
    return rotulo + (valor ?? '');
}

function linhaDuasColunas(label1, valor1, label2, valor2, larguraLabel = LABEL_WIDTH_TWO_COL, larguraTotalColuna = TWO_COL_TOTAL) {
    const col1 = (label1 + ':').padEnd(larguraLabel, ' ') + (valor1 ?? '');
    const col1Pad = col1.padEnd(larguraTotalColuna, ' ');
    const col2 = (label2 + ':').padEnd(larguraLabel, ' ') + (valor2 ?? '');
    return col1Pad + col2;
}

function calcularMesesEntreDatas(inicioStr, cancelamentoStr) {
    if (!inicioStr || !cancelamentoStr) return null;
    const inicio = new Date(inicioStr);
    const fim = new Date(cancelamentoStr);
    if (isNaN(inicio) || isNaN(fim) || fim < inicio) return null;
    let meses = (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth());
    if (fim.getDate() < inicio.getDate()) meses -= 1;
    return Math.max(0, meses);
}

function calcularEstorno() {
    const nomePlano = (document.getElementById('nomePlano') || {}).value || '';
    const idAluno = (document.getElementById('idAluno') || {}).value || '';
    const dataInicio = (document.getElementById('dataInicio') || {}).value || '';
    const dataCancelamento = (document.getElementById('dataCancelamento') || {}).value || '';
    const valorMensalidade = parseFloat(document.getElementById('valorMensalidade').value);
    const totalMeses = parseInt(document.getElementById('totalMeses').value);
    const mesesUtilizadosInput = parseInt(document.getElementById('mesesUtilizados').value);
    const percentualMulta = parseFloat(document.getElementById('percentualMulta').value);
    const resultadoDiv = document.getElementById('resultado');
    const saidaTextarea = document.getElementById('saida');
    const motivo = (document.getElementById('motivo') || {}).value || '';
    const autorizacao = (document.getElementById('autorizacao') || {}).value || '';
    const cartaoFinal = (document.getElementById('cartaoFinal') || {}).value || '';

    let mesesUtilizados = mesesUtilizadosInput;
    const mesesPorData = calcularMesesEntreDatas(dataInicio, dataCancelamento);
    if (mesesPorData !== null) mesesUtilizados = mesesPorData;

    if (isNaN(valorMensalidade) || isNaN(totalMeses) || isNaN(mesesUtilizados) || isNaN(percentualMulta)) {
        resultadoDiv.innerHTML = `<p class="error-message">Por favor, preencha todos os campos com números válidos.</p>`;
        return;
    }
    if (mesesUtilizados >= totalMeses) {
        resultadoDiv.innerHTML = `<p class="error-message">O contrato já foi concluído ou ultrapassado. Não há valores a serem estornados por cancelamento.</p>`;
        return;
    }

    const mesesRestantes = totalMeses - mesesUtilizados;
    const valorRestante = mesesRestantes * valorMensalidade;
    const valorMulta = valorRestante * (percentualMulta / 100);
    const valorUtilizado = mesesUtilizados * valorMensalidade;
    const totalDevido = valorUtilizado + valorMulta;
    const valorTotalContrato = totalMeses * valorMensalidade;
    const valorEstorno = valorTotalContrato - totalDevido;

    let htmlResultado = `
        <p><strong>Valor Total do Contrato:</strong> ${formatarMoeda(valorTotalContrato)}</p>
        <p><strong>Valor referente aos meses restantes:</strong> ${formatarMoeda(valorRestante)}</p>
        <p><strong>Multa de ${percentualMulta}% sobre o restante:</strong> ${formatarMoeda(valorMulta)}</p>
        <p><strong>Total devido (meses usados + multa):</strong> ${formatarMoeda(totalDevido)}</p>
    `;

    if (valorEstorno > 0) {
        htmlResultado += `<p class="final-result">Estorno a ser recebido: ${formatarMoeda(valorEstorno)}</p>`;
    } else {
        htmlResultado += `<p class="final-result" style="color: #dc3545;">Não há valor de estorno. Saldo devedor: ${formatarMoeda(Math.abs(valorEstorno))}</p>`;
    }

    resultadoDiv.innerHTML = htmlResultado;

    const inicioStr = dataInicio ? new Date(dataInicio).toLocaleDateString('pt-BR') : '';
    const cancelStr = dataCancelamento ? new Date(dataCancelamento).toLocaleDateString('pt-BR') : '';
    const linhaValor = `${formatarMoeda(valorTotalContrato)} em ${totalMeses}x de ${formatarMoeda(valorMensalidade)}`;

    const headerPlano = nomePlano ? nomePlano : 'Plano';
    const header = `CANCELAMENTO (${headerPlano}:*: ID: ${idAluno || ''})`;
    const linhaDatas = linhaDuasColunas('Inicio', inicioStr, 'Cancelamento', cancelStr);
    const linhaMesesUsados = linha('Meses utilizados', `${mesesUtilizados}`);
    const linhaMesesRest = linha('Meses restantes', `${mesesRestantes}`);
    const linhaValorFmt = linha('Valor', linhaValor);
    const linhaTaxa = linha(`Taxa de ${percentualMulta}%`, `= ${formatarMoeda(valorMulta)}`);
    const linhaEstorno = linha('Estorno R$', `= ${formatarMoeda(Math.max(0, valorEstorno))}`);
    const linhaMotivo = linha('Motivo', `${motivo}`);
    const linhaAutorizacao = linha('Autorização', `${autorizacao}`);
    const linhaCartao = linha('Cartão final', `${cartaoFinal}`);

    const saida = [
        header,
        '',
        linhaDatas,
        linhaMesesUsados,
        linhaMesesRest,
        linhaValorFmt,
        linhaTaxa,
        linhaEstorno,
        '',
        linhaMotivo,
        linhaAutorizacao,
        linhaCartao
    ].join('\n');

    if (saidaTextarea) {
        saidaTextarea.value = saida;
    }
}

function copiarSaida() {
    const saidaTextarea = document.getElementById('saida');
    if (!saidaTextarea) return;
    const texto = saidaTextarea.value;
    if (!texto) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto);
        return;
    }
    saidaTextarea.select();
    document.execCommand('copy');
}


