export function normalizarClienteId(valor) {
    if (valor === null || valor === undefined || valor === '') {
        return null
    }

    const numero = Number(valor)
    return Number.isNaN(numero) ? null : numero
}
