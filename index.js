require("dotenv").config();
const axios = require("axios");

const PRINTIFY_API_URL = "https://api.printify.com/v1";
const TIENDANUBE_API_URL = `https://api.tiendanube.com/v1/${process.env.TIENDANUBE_STORE_ID}/products`;

const headersPrintify = {
    "Authorization": `Bearer ${process.env.PRINTIFY_TOKEN}`,
    "Content-Type": "application/json"
};

const headersTiendanube = {
    "Authorization": `Bearer ${process.env.TIENDANUBE_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
};

// Obtener productos de Printify
async function getPrintifyProducts() {
    try {
        const response = await axios.get(`${PRINTIFY_API_URL}/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`, { headers: headersPrintify });
        return response.data.data;
    } catch (error) {
        console.error("❌ Error obteniendo productos de Printify", error.response ? error.response.data : error.message);
        return [];
    }
}

// Crear producto en Tiendanube
async function createTiendanubeProduct(product) {
    try {
        const productData = {
            name: product.title,
            description: product.description || "Sin descripción",
            variants: product.variants.map(variant => ({
                price: variant.price,
                stock: variant.available || 0,
                sku: variant.sku || "N/A"
            })),
            images: product.images.map(image => ({ src: image.src }))
        };

        const response = await axios.post(TIENDANUBE_API_URL, productData, { headers: headersTiendanube });
        console.log(`✅ Producto "${product.title}" creado en Tiendanube`);
    } catch (error) {
        console.error(`❌ Error creando el producto "${product.title}"`, error.response ? error.response.data : error.message);
    }
}

// Sincronizar productos
async function syncProducts() {
    const products = await getPrintifyProducts();
    if (products.length === 0) {
        console.log("⚠️ No hay productos en Printify para sincronizar.");
        return;
    }

    for (const product of products) {
        await createTiendanubeProduct(product);
    }
}

// Ejecutar sincronización
syncProducts();
