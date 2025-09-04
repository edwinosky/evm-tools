const solc = require('solc');
const fs = require('fs');
const path = require('path');

console.log("Iniciando la compilación de los contratos de airdrop...");

const contractsDir = path.resolve(__dirname, '..', 'contracts', 'airdrop');
const outputDir = path.resolve(__dirname, '..', 'src', 'lib', 'abi', 'airdrop');

// Asegurarse de que el directorio de salida exista
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const contractFiles = fs.readdirSync(contractsDir).filter(file => file.endsWith('.sol'));

if (contractFiles.length === 0) {
  console.log("No se encontraron archivos de contrato .sol en el directorio de contratos.");
  process.exit(0);
}

const sources = contractFiles.reduce((acc, file) => {
  const filePath = path.join(contractsDir, file);
  acc[file] = {
    content: fs.readFileSync(filePath, 'utf8')
  };
  return acc;
}, {});

const input = {
  language: 'Solidity',
  sources: sources,
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode']
      }
    },
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};

function findImports(importPath) {
  try {
    // Ruta a node_modules dentro del directorio del servidor
    const serverNodeModules = path.resolve(__dirname, 'node_modules');
    const nodeModulesPath = path.join(serverNodeModules, importPath);
    console.log(`Intentando importar desde: ${nodeModulesPath}`);
    if (fs.existsSync(nodeModulesPath)) {
      return { contents: fs.readFileSync(nodeModulesPath, 'utf8') };
    }

    // Ruta a los contratos locales (si se importan entre sí)
    const localPath = path.join(contractsDir, importPath);
    console.log(`Intentando importar desde: ${localPath}`);
     if (fs.existsSync(localPath)) {
      return { contents: fs.readFileSync(localPath, 'utf8') };
    }
    
    console.error(`Archivo no encontrado: ${importPath}`);
    return { error: `Archivo no encontrado: ${importPath}` };
  } catch (error) {
    console.error(`Error al resolver la importación: ${importPath} - ${error.message}`);
    return { error: `Error al resolver la importación: ${importPath} - ${error.message}` };
  }
}

console.log("Compilando contratos...");
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
  const errors = output.errors.filter(e => e.severity === 'error');
  if (errors.length > 0) {
    console.error("Errores de compilación:");
    errors.forEach(err => {
      console.error(err.formattedMessage);
    });
    process.exit(1);
  }
}

console.log("Compilación exitosa. Escribiendo archivos de salida...");

const bytecodeExports = {};

for (const contractFile in output.contracts) {
  for (const contractName in output.contracts[contractFile]) {
    const contract = output.contracts[contractFile][contractName];

    // Guardar ABI
    const abiPath = path.join(outputDir, `${contractName}.json`);
    fs.writeFileSync(abiPath, JSON.stringify(contract.abi, null, 2));
    console.log(`✅ ABI guardado para ${contractName} en ${abiPath}`);

    // Almacenar bytecode
    bytecodeExports[contractName] = '0x' + contract.evm.bytecode.object;
  }
}

// Guardar Bytecodes
const bytecodeFileContent = `export const AirdropBytecode = ${JSON.stringify(bytecodeExports, null, 2)};\n`;
const bytecodeFilePath = path.join(outputDir, 'AirdropBytecode.ts');
fs.writeFileSync(bytecodeFilePath, bytecodeFileContent);
console.log(`✅ Bytecodes guardados en ${bytecodeFilePath}`);

console.log("\n🎉 Compilación de contratos de airdrop completada.");
