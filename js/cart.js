class Cart {
    static producto;
    static gustos;

    constructor(producto, gustos = []) {
        this.id = `${Math.random()}-${Math.random()}-${Math.random()}`;
        this.producto = producto;
        this.gustos = gustos;
    }

    calcularPrecio() {
        return this.producto.precio
    }

    alternarGusto(gusto) {
        const index = this.gustos.findIndex(g => g === gusto);
        if (index !== -1) {
            this.gustos.splice(index, 1);
        } else {
            if (this.gustos.length < 4) {
                this.gustos.push(gusto);
            }
        }
    }

    finalizarCompra() {
        alert(`Se pagó un total de $ ${this.producto.precio}`)
    }
}
