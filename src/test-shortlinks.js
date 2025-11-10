import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import SDK for REST calls with HMAC auth
import { request } from './sdk/helper.js';

// Configuración de la API desde .env
const API_BASE_URL = process.env.URL || 'https:URL/api/rest';

const ACCOUNTS = [
  { 
    name: "Account from ENV", 
    apiKey: process.env.API_KEY, 
    apiSecret: process.env.API_SECRET 
  }
];

console.log("TEST SHORTLINK API");
console.log("==========================");
console.log(`URL: ${API_BASE_URL}short_link`);
console.log(`API Keys configuradas: ${ACCOUNTS.length}`);
ACCOUNTS.forEach((account, index) => {
  console.log(`   ${index + 1}. ${account.name} - API Key: ${account.apiKey?.slice(0, 8)}...`);
});
console.log("Objetivo: Crear shortlinks via POST con autenticación HMAC-SHA1");
console.log("");

// Función para generar URLs de prueba
const getRandomLongUrl = () => {
  const baseUrls = [
    "https://www.ejemplo.com/mi-pagina-muy-larga-con-parametros",
    "https://www.google.com/search?q=test+shortlink+api+local+development",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmRdnEQy6nuLMOVdJmC2_8q1uJ",
    "https://www.amazon.com/producto-super-largo-con-muchos-parametros-y-filtros",
    "https://www.facebook.com/groups/comunidad-desarrolladores-guatemala/posts/123456789",
    "https://www.github.com/usuario/repositorio-muy-largo/commits/abc123def456ghi789",
    "https://www.stackoverflow.com/questions/123456/como-crear-shortlinks-con-api-rest",
    "https://www.linkedin.com/in/perfil-profesional-desarrollador-guatemala",
    "https://www.twitter.com/usuario/status/1234567890123456789",
    "https://www.instagram.com/p/ABC123DEF456GHI789JKL/"
  ];
  
  return baseUrls[Math.floor(Math.random() * baseUrls.length)];
};

// Función para generar nombres de prueba
const getRandomName = () => {
  const names = [
    "Test Shortlink desde REST API",
    "Enlace corto de prueba",
    "Shortlink para testing",
    "Link de desarrollo local",
    "Prueba API Shortlink",
    "Test desde Node.js",
    "Shortlink automático",
    "Enlace de prueba local",
    "Test API REST",
    "Shortlink generado automáticamente"
  ];
  
  return names[Math.floor(Math.random() * names.length)];
};

// Función para generar status
const getRandomStatus = () => {
  const statuses = ["ACTIVE", "INACTIVE"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomAlias = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 6 + Math.floor(Math.random() * 10);
  let alias = "";
  for (let i = 0; i < length; i++) {
    alias += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return alias;
};

// Función para enviar POST request CON AUTENTICACIÓN HMAC
const createShortlink = async (account, longUrl, name, status, alias) => {
  try {
    const payload = {
      long_url: longUrl,
      name,
      status: status
    };

    if (alias) {
      payload.alias = alias;
    }

    console.log(`${account.name} - Enviando POST request con HMAC auth...`);
    console.log(`   API Key: ${account.apiKey.slice(0, 9)}...`);
    console.log(`   URL: ${longUrl}`);
    console.log(`   Name: ${name}`);
    console.log(`   Status: ${status}`);
    console.log(`   Alias: ${alias || "(auto)"}`);
    console.log("");

    // Configurar las credenciales en process.env para el helper
    process.env.API_KEY = account.apiKey;
    process.env.API_SECRET = account.apiSecret;
    process.env.URL = API_BASE_URL;
    
    // Usar el SDK request function para enviar con HMAC
    const response = await request({
      type: 'post',
      endpoint: 'short_link',
      data: payload
    });

    if (response.ok) {
      console.log("SUCCESS!");
      console.log(`   Status: ${response.code}`);
      console.log(`   Response:`, JSON.stringify(response.data, null, 2));
      console.log("");

      return {
        success: true,
        account: account.name,
        status: response.code,
        data: response.data
      };
    } else {
      console.log("ERROR!");
      console.log(`   Status: ${response.code}`);
      console.log(`   Error:`, JSON.stringify(response.data, null, 2));
      console.log("");

      return {
        success: false,
        account: account.name,
        status: response.code,
        data: response.data
      };
    }

  } catch (error) {
    console.log("ERROR!");
    console.log(`   Error: ${error.message}`);
    console.log("   Check if server is running");
    console.log("");

    return {
      success: false,
      account: account.name,
      error: error.message,
      status: null,
      data: null
    };
  }
};

// Función para test individual
const testSingleShortlink = async (customAlias = null) => {
  console.log("TEST INDIVIDUAL SHORTLINK");
  console.log("=============================");
  
  // Seleccionar cuenta aleatoria
  const account = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
  const longUrl = getRandomLongUrl();
  const name = getRandomName();
  const status = "ACTIVE";
  const alias = customAlias !== null ? customAlias : (Math.random() < 0.6 ? getRandomAlias() : null);
  
  console.log(`Cuenta: ${account.name}`);
  console.log(`URL: ${longUrl}`);
  console.log("");
  
  const result = await createShortlink(account, longUrl, name, status, alias);
  
  if (result.success) {
    console.log(`Test individual ${account.name} exitoso!`);
  } else {
    console.log(`Test individual ${account.name} falló!`);
  }
  
  return result;
};

// Función para test múltiple
const testMultipleShortlinks = async (count = 5) => {
  console.log(`TEST MULTIPLE SHORTLINKS (${count} requests)`);
  console.log("================================================");
  
  const results = {
    success: 0,
    error: 0,
    total: count
  };
  const accountStats = {};
  
  // Inicializar estadísticas por cuenta
  ACCOUNTS.forEach(account => {
    accountStats[account.name] = {
      total: 0,
      success: 0,
      error: 0
    };
  });
  
  for (let i = 1; i <= count; i++) {
    console.log(`\nRequest #${i}/${count}`);
    console.log("-".repeat(30));
    
    // Seleccionar cuenta aleatoria
    const account = ACCOUNTS[Math.floor(Math.random() * ACCOUNTS.length)];
    const longUrl = getRandomLongUrl();
    const name = getRandomName();
    const status = getRandomStatus();
    const alias = Math.random() < 0.6 ? getRandomAlias() : null;
    
    console.log(`Cuenta: ${account.name}`);
    
    const result = await createShortlink(account, longUrl, name, status, alias);
    
    // Actualizar estadísticas
    accountStats[account.name].total++;
    if (result.success) {
      results.success++;
      accountStats[account.name].success++;
    } else {
      results.error++;
      accountStats[account.name].error++;
    }
    
    // Pausa entre requests
    if (i < count) {
      console.log("Esperando 2 segundos...");
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log("\nRESUMEN FINAL");
  console.log("================");
  console.log(`Exitosos: ${results.success}`);
  console.log(`Errores: ${results.error}`);
  console.log(`Total: ${results.total}`);
  console.log(`Tasa de éxito: ${((results.success / results.total) * 100).toFixed(1)}%`);
  
  console.log(`\nESTADISTICAS POR CUENTA:`);
  Object.entries(accountStats).forEach(([account, stats]) => {
    if (stats.total > 0) {
      console.log(`\n   ${account}:`);
      console.log(`     Total: ${stats.total}`);
      console.log(`     Exitosos: ${stats.success}`);
      console.log(`     Errores: ${stats.error}`);
      console.log(`     Tasa: ${((stats.success / stats.total) * 100).toFixed(1)}%`);
    }
  });
  
  return results;
};

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];

const testStatusValidation = async () => {
  console.log("TEST VALIDACION DE STATUS");
  console.log("============================");
  
  const account = ACCOUNTS[0];
  const longUrl = getRandomLongUrl();
  const name = "Test Status Validation";
  
  const invalidStatuses = ["PENDING", "DRAFT", "DELETED", "SUSPENDED", "active", "inactive", "Active", "Inactive", "ACTIVE ", " INACTIVE", "ACTIVE\n", "INACTIVE\t"];
  
  for (const status of invalidStatuses) {
    console.log(`\nProbando status inválido: "${status}"`);
    await createShortlink(account, longUrl, `${name} - ${status}`, status, null);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\nProbando status válido: "ACTIVE"`);
  await createShortlink(account, longUrl, `${name} - ACTIVE`, "ACTIVE", null);
  
  console.log(`\nProbando status válido: "INACTIVE"`);
  await createShortlink(account, longUrl, `${name} - INACTIVE`, "INACTIVE", null);
  
  console.log(`\nProbando sin status (debería default a ACTIVE)`);
  await createShortlink(account, longUrl, `${name} - No Status`, null, null);
};

const testListShortlinks = async () => {
  console.log("TEST LISTA DE SHORTLINKS");
  console.log("===========================");
  
  const account = ACCOUNTS[0];
  console.log(`Usando cuenta: ${account.name}`);
  console.log(`Endpoint: GET ${API_BASE_URL}short_link/`);
  console.log("");
  
  try {
    process.env.API_KEY = account.apiKey;
    process.env.API_SECRET = account.apiSecret;
    process.env.URL = API_BASE_URL;
    
    const response = await request({
      type: 'GET',
      endpoint: 'short_link/',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("RESPUESTA EXITOSA:");
    console.log("====================");
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.data.success}`);
    console.log(`Message: ${response.data.message}`);
    console.log(`Account ID: ${response.data.account_id}`);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log(`Shortlinks encontrados: ${response.data.data.length}`);
      console.log("");
      console.log("LISTA DE SHORTLINKS:");
      console.log("=======================");
      
      response.data.data.forEach((shortlink, index) => {
        console.log(`${index + 1}. ID: ${shortlink._id || shortlink.url_id}`);
        console.log(`   Name: ${shortlink.name}`);
        console.log(`   Alias: ${shortlink.alias || "(auto)"}`);
        console.log(`   Short URL: ${shortlink.short_url}`);
        console.log(`   Long URL: ${shortlink.long_url || shortlink.url}`);
        console.log(`   Status: ${shortlink.status}`);
        console.log(`   Created By: ${shortlink.created_by}`);
        console.log(`   Created On: ${shortlink.created_on}`);
        console.log(`   Visits: ${shortlink.visits}`);
        console.log(`   Unique Visits: ${shortlink.unique_visits}`);
        console.log(`   Preview Visits: ${shortlink.preview_visits}`);
        console.log("");
      });
    } else {
      console.log("No se encontraron shortlinks para esta cuenta");
    }
    
  } catch (error) {
    console.log("ERROR:");
    console.log("=========");
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data?.message || 'Error desconocido'}`);
      console.log(`Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
};


const testGetShortlinkById = async (shortLinkId = "id123") => {
  console.log("TEST SHORTLINK POR ID");
  console.log("========================");
  
  const account = ACCOUNTS[0];
  console.log(`Usando cuenta: ${account.name}`);
  console.log(`Endpoint: GET ${API_BASE_URL}short_link/?id=${shortLinkId}`);
  console.log(`Shortlink ID: ${shortLinkId}`);
  console.log("");
  
  try {
    process.env.API_KEY = account.apiKey;
    process.env.API_SECRET = account.apiSecret;
    process.env.URL = API_BASE_URL;

    const response = await request({
      type: 'GET',
      endpoint: 'short_link/',
      params: {
        id: shortLinkId
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("RESPUESTA EXITOSA:");
    console.log("====================");
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.data.success}`);
    console.log(`Message: ${response.data.message}`);
    console.log(`Account ID: ${response.data.account_id}`);
    
    console.log("");
    console.log("DEBUG - RESPUESTA COMPLETA:");
    console.log("===============================");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("");
    
    if (response.data.url_id) {
      console.log("");
      console.log("DETALLES DEL SHORTLINK:");
      console.log("==========================");
      console.log(`ID: ${response.data.url_id}`);
      console.log(`Name: ${response.data.name}`);
      console.log(`Alias: ${response.data.alias || "(auto)"}`);
      console.log(`Short URL: ${response.data.short_url}`);
      console.log(`Long URL: ${response.data.long_url}`);
      console.log(`Status: ${response.data.status}`);
      console.log(`Created By: ${response.data.created_by}`);
      console.log(`Created On: ${response.data.created_on}`);
      
      console.log("");
      console.log("ESTADISTICAS DE VISITAS:");
      console.log("===========================");
      console.log(`Total Visits: ${response.data.visits}`);
      console.log(`Unique Visits: ${response.data.unique_visits}`);
      console.log(`Preview Visits: ${response.data.preview_visits}`);
    }
    
  } catch (error) {
    console.log("ERROR:");
    console.log("=========");
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data?.message || 'Error desconocido'}`);
      console.log(`Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
};

const testListShortlinksByDate = async (startDate = null, endDate = null, limit = 10, offset = -6) => {
  console.log("TEST LISTAR SHORTLINKS POR FECHA");
  console.log("====================================");
  
  const account = ACCOUNTS[0];
  console.log(`Usando cuenta: ${account.name}`);
  console.log(`Endpoint: GET ${API_BASE_URL}short_link/`);
  console.log(`Fecha inicio: ${startDate || 'No especificada'}`);
  console.log(`Fecha fin: ${endDate || 'No especificada'}`);
  console.log(`Límite: ${limit}`);
  console.log(`Offset: ${offset} horas`);
  console.log("");
  
  try {
    process.env.API_KEY = account.apiKey;
    process.env.API_SECRET = account.apiSecret;
    process.env.URL = API_BASE_URL;

    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (limit) params.limit = limit;
    if (offset !== -6) params.offset = offset;

    const response = await request({
      type: 'GET',
      endpoint: 'short_link/',
      params: params,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("RESPUESTA EXITOSA:");
    console.log("====================");
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.data.success}`);
    console.log(`Message: ${response.data.message}`);
    console.log(`Account ID: ${response.data.account_id}`);
    
    console.log("");
    console.log("DEBUG - RESPUESTA COMPLETA:");
    console.log("===============================");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("");
    
    if (response.data.data && response.data.data.length > 0) {
      console.log("");
      console.log(`SHORTLINKS ENCONTRADOS (${response.data.data.length}):`);
      console.log("===============================================");
      
      response.data.data.forEach((shortlink, index) => {
        const offsetHours = offset || -6;
        console.log(`\n${index + 1}. ${shortlink.name}`);
        console.log(`   ID: ${shortlink._id}`);
        console.log(`   Alias: ${shortlink.alias || "(auto)"}`);
        console.log(`   Short URL: ${shortlink.short_url}`);
        console.log(`   Long URL: ${shortlink.long_url}`);
        console.log(`   Status: ${shortlink.status}`);
        console.log(`   Created: ${shortlink.created_on} (Hora local UTC${offsetHours >= 0 ? '+' : ''}${offsetHours})`);
        console.log(`   Created By: ${shortlink.created_by}`);
        
        console.log(`   Estadísticas:`);
        console.log(`      Total Visits: ${shortlink.visits}`);
        console.log(`      Unique Visits: ${shortlink.unique_visits}`);
        console.log(`      Preview Visits: ${shortlink.preview_visits}`);
      });
    } else {
      console.log("No se encontraron shortlinks con los criterios especificados");
    }
    
  } catch (error) {
    console.log("ERROR:");
    console.log("=========");
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data?.message || 'Error desconocido'}`);
      console.log(`Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
};

const testUpdateShortlinkStatus = async (shortLinkId, newStatus = "INACTIVE") => {
  if (!shortLinkId) {
    console.error("Shortlink ID is required to update status.");
    return;
  }
  console.log("TEST ACTUALIZAR STATUS DE SHORTLINK");
  console.log("=====================================");
  
  const account = ACCOUNTS[0];
  console.log(`Usando cuenta: ${account.name}`);
  console.log(`Endpoint: PUT ${API_BASE_URL}short_link/${shortLinkId}/status`);
  console.log(`Shortlink ID: ${shortLinkId}`);
  console.log(`Nuevo Status: ${newStatus}`);
  console.log("");
  
  try {
    process.env.API_KEY = account.apiKey;
    process.env.API_SECRET = account.apiSecret;
    process.env.URL = API_BASE_URL;

    const response = await request({
      type: 'PUT',
      endpoint: `short_link/${shortLinkId}/status`,
      params: {
        id: shortLinkId
      },
      data: {
        status: newStatus
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("RESPUESTA EXITOSA:");
    console.log("====================");
    console.log(`Status: ${response.status}`);
    console.log(`Success: ${response.data.success}`);
    console.log(`Message: ${response.data.message}`);
    console.log(`Account ID: ${response.data.account_id}`);
    
    console.log("");
    console.log("DEBUG - RESPUESTA COMPLETA:");
    console.log("===============================");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("");
    
    if (response.data.url_id) {
      console.log("");
      console.log("DETALLES DEL SHORTLINK ACTUALIZADO:");
      console.log("======================================");
      console.log(`ID: ${response.data.url_id}`);
      console.log(`Name: ${response.data.name}`);
      console.log(`Short URL: ${response.data.short_url}`);
      console.log(`Long URL: ${response.data.long_url}`);
      console.log(`Status: ${response.data.status} <- ACTUALIZADO`);
      console.log(`Created By: ${response.data.created_by}`);
      console.log(`Created On: ${response.data.created_on}`);
      
      console.log("");
      console.log("ESTADISTICAS DE VISITAS:");
      console.log("===========================");
      console.log(`Total Visits: ${response.data.visits}`);
      console.log(`Unique Visits: ${response.data.unique_visits}`);
      console.log(`Preview Visits: ${response.data.preview_visits}`);
    }
    
  } catch (error) {
    console.log("ERROR:");
    console.log("=========");
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data?.message || 'Error desconocido'}`);
      console.log(`Response:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
    }
  }
};

if (command === "single") {
  const aliasArg = args[1] ? args[1].trim() : null;
  testSingleShortlink(aliasArg && aliasArg.length > 0 ? aliasArg : null);
} else if (command === "multiple") {
  const count = parseInt(args[1]) || 5;
  testMultipleShortlinks(count);
} else if (command === "status") {
  testStatusValidation();
} else if (command === "list") {
  testListShortlinks();
} else if (command === "id") {
  const shortLinkId = args[1] || "id123";
  testGetShortlinkById(shortLinkId);
} else if (command === "update") {
  if (!args[1]) {
    console.error("Missing shortlink ID. Usage: node src/test-shortlinks.js update <shortlinkId> [ACTIVE|INACTIVE]");
    process.exit(1);
  }
  const shortLinkId = args[1];
  const newStatus = args[2] || "INACTIVE";
  testUpdateShortlinkStatus(shortLinkId, newStatus);
} else if (command === "date") {
  const startDate = args[1] || null;
  const endDate = args[2] || null;
  const limit = parseInt(args[3]) || 10;
  const offset = parseInt(args[4]) || -6;
  testListShortlinksByDate(startDate, endDate, limit, offset);
} else {
  console.log("SHORTLINK API TEST");
  console.log("====================");
  console.log("");
  console.log("Uso:");
  console.log("  node src/test-shortlinks.js single [alias]    - Test individual (alias opcional)");
  console.log("  node src/test-shortlinks.js multiple   - Test múltiple (5 requests)");
  console.log("  node src/test-shortlinks.js multiple 10 - Test múltiple (10 requests)");
  console.log("  node src/test-shortlinks.js status     - Test validación de status");
  console.log("  node src/test-shortlinks.js list       - Test lista de shortlinks (GET)");
  console.log("  node src/test-shortlinks.js id        - Test shortlink por ID (GET con query param)");
  console.log("  node src/test-shortlinks.js id id123   - Test shortlink por ID específico");
  console.log("  node src/test-shortlinks.js update    - Test actualizar status (PUT)");
  console.log("  node src/test-shortlinks.js update id123 ACTIVE - Test actualizar status específico");
  console.log("  node src/test-shortlinks.js date      - Test lista por fecha (últimos 10)");
  console.log("  node src/test-shortlinks.js date 2024-01-01 - Test lista desde fecha específica");
  console.log("  node src/test-shortlinks.js date 2024-01-01 2024-12-31 - Test lista entre fechas");
  console.log("  node src/test-shortlinks.js date 2024-01-01 2024-12-31 20 - Test lista entre fechas con límite");
  console.log("  node src/test-shortlinks.js date 2024-01-01 2024-12-31 20 -5 - Test con timezone New York");
  console.log("");
  console.log("Ejemplo de uso:");
  console.log("  node src/test-shortlinks.js single myAlias123");
  console.log("  node src/test-shortlinks.js list");
  console.log("  node src/test-shortlinks.js id id123");
  console.log("  node src/test-shortlinks.js update id123 ACTIVE");
  console.log("  node src/test-shortlinks.js date 2024-01-01 2024-12-31 20 -5");
  console.log("");
  
  testSingleShortlink();
}
