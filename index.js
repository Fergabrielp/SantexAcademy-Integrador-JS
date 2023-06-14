/*
En el archivo tarea2.js podemos encontrar un código de un supermercado que vende productos.
El código contiene 
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
*/


// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }
}


// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];


// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}, espere por favor...`);

        // Busco el producto en la "base de datos"
        const producto = findProductBySku(sku);

        await producto.then((prod) => {
            console.log("Producto encontrado", prod);
            // Si el producto existe en el carrito, agrego solamente la cantidad. Sino agrego un producto completo
            const existeEnCarrito = this.productos.find(produ => produ.sku === sku)
            if (existeEnCarrito) {
                this.productos.map(prodCart => {
                    if(prodCart.sku === prod.sku){
                        prodCart.cantidad += cantidad
                    }
                })
                this.precioTotal = this.precioTotal + (prod.precio * cantidad);
            }else {
                // Creo un producto nuevo
                const nuevoProducto = new ProductoEnCarrito(sku, prod.nombre, cantidad);
                const existeCategoria = this.categorias.find(cat => cat === prod.categoria)
                if (existeCategoria) {
                    this.productos.push(nuevoProducto);
                    this.precioTotal = this.precioTotal + (prod.precio * cantidad);
                } else {                    
                    this.productos.push(nuevoProducto);
                    this.precioTotal = this.precioTotal + (prod.precio * cantidad);
                    this.categorias.push(prod.categoria);
                }
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    //Ejercicio 2 Agregar la función eliminarProducto a la clase Carrito y que devuelva una promesa.

    async eliminarProducto(sku, cantidad) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const foundProduct = this.productos.filter(product => product.sku === sku)[0];
                if (foundProduct) {
                    if(cantidad < foundProduct.cantidad){
                        this.productos.map(prodCart => {
                            if(prodCart.sku === sku){
                                prodCart.cantidad -= cantidad
                            }
                        })
                        resolve(`Se restaron ${cantidad} unidades al producto ${sku}`);
                    }else{
                        this.productos = this.productos.filter(prodCart => prodCart.sku !== sku)
                        resolve(`El producto ${sku} se eliminó completamente del carrito.`)
                        console.log(carrito)
                    }
                } else {
                    reject(`El producto ${sku} ingresado no existe, intente nuevamente`);
                }
            }, 1500);
        });
    }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`El producto ${sku} no se encontró en la base de datos, intente nuevamente.`);
            }
        }, 1500);
    });
}

const carrito = new Carrito();

carrito.agregarProducto('KS944RUR', 2);



//Ejercicio N° 3 Utilizar la función eliminarProducto utilizando .then() y .catch()

const eliminarProd = carrito.eliminarProducto('KS944RUR', 1)

eliminarProd.then((res) => {
    console.log(res)
}).catch((err)=> {
    console.log(err)
})









