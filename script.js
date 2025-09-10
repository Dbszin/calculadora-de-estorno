function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularEstorno() {
    const valorMensalidade = parseFloat(document.getElementById('valorMensalidade').value);
    const totalMeses = parseInt(document.getElementById('totalMeses').value);
    const mesesUtilizados = parseInt(document.getElementById('mesesUtilizados').value);
    const percentualMulta = parseFloat(document.getElementById('percentualMulta').value);
    const resultadoDiv = document.getElementById('resultado');

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
}


