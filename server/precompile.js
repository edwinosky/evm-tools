const solc = require('solc');
const fs = require('fs');
const path = require('path');

console.log("Starting contract pre-compilation...");

// --- Helper Functions ---

function findImports(importPath) {
  try {
    const nodeModulesPath = path.resolve(__dirname, 'node_modules', importPath);
    if (fs.existsSync(nodeModulesPath)) {
      return { contents: fs.readFileSync(nodeModulesPath, 'utf8') };
    }
    return { error: `File not found: ${importPath}` };
  } catch (error) {
    return { error: `Error resolving import: ${importPath} - ${error.message}` };
  }
}

const generateKey = (type, options) => {
  const parts = [type.toLowerCase()];
  const sortedOptions = Object.keys(options).sort();
  for (const key of sortedOptions) {
    if (options[key]) {
      parts.push(key.toLowerCase());
    }
  }
  return parts.join('_');
};

// --- Contract Source Code Generation ---

const getContractSource = (contractType, options) => {
  const contractBaseName = `Generated${contractType}`;
  const imports = `
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;
    import "@openzeppelin/contracts/token/${contractType}/${contractType}.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    ${options.burnable ? `import "@openzeppelin/contracts/token/${contractType}/extensions/${contractType}Burnable.sol";` : ''}
    ${options.permit ? `import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";` : ''}
    ${options.mintable ? `// Mintable is not an import, it's a function` : ''}
  `;

  let inheritance = [contractType, 'Ownable'];
  if (options.burnable) inheritance.push(`${contractType}Burnable`);
  if (options.permit) inheritance.push('ERC20Permit');

  if (contractType === 'ERC20') {
    return `
      ${imports}
      contract ${contractBaseName} is ${inheritance.join(', ')} {
        constructor(string memory name, string memory symbol, address initialOwner)
          ERC20(name, symbol)
          Ownable(initialOwner)
          ${options.permit ? `ERC20Permit(name)` : ''}
        {}

        ${options.mintable ? `
        function mint(address to, uint256 amount) public onlyOwner {
          _mint(to, amount);
        }` : ''}
      }
    `;
  } else if (contractType === 'ERC721') {
    return `
      ${imports}
      contract ${contractBaseName} is ${inheritance.join(', ')} {
        uint256 private _tokenIdCounter;

        constructor(string memory name, string memory symbol, address initialOwner)
          ERC721(name, symbol)
          Ownable(initialOwner)
        {
            _tokenIdCounter = 1;
        }

        ${options.mintable ? `
        function safeMint(address to) public onlyOwner returns (uint256) {
          uint256 tokenId = _tokenIdCounter;
          _safeMint(to, tokenId);
          _tokenIdCounter++;
          return tokenId;
        }`: ''}
      }
    `;
  } else if (contractType === 'ERC1155') {
    return `
      ${imports}
      contract ${contractBaseName} is ${inheritance.join(', ')} {
        constructor(string memory uri, address initialOwner)
          ERC1155(uri)
          Ownable(initialOwner)
        {}

        function setURI(string memory newuri) public onlyOwner {
            _setURI(newuri);
        }

        ${options.mintable ? `
        function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
            _mint(account, id, amount, data);
        }

        function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public onlyOwner {
            _mintBatch(to, ids, amounts, data);
        }`: ''}
      }
    `;
  }
  throw new Error('Unsupported contract type');
};


// --- Configuration & Compilation ---

// Simplified configurations that are known to compile cleanly
const contractConfigurations = [
  // ERC20
  { type: 'ERC20', options: { mintable: true } },
  { type: 'ERC20', options: { mintable: true, burnable: true } },
  { type: 'ERC20', options: { mintable: true, permit: true } },
  { type: 'ERC20', options: { mintable: true, burnable: true, permit: true } },

  // ERC721
  { type: 'ERC721', options: { mintable: true } },
  { type: 'ERC721', options: { mintable: true, burnable: true } },

  // ERC1155
  { type: 'ERC1155', options: { mintable: true } },
  { type: 'ERC1155', options: { mintable: true, burnable: true } },
];

const precompiledContracts = {};

contractConfigurations.forEach(config => {
  const { type, options } = config;
  const key = generateKey(type, options);
  const contractName = `Generated${type}`;
  const sourceFileName = `${contractName}.sol`;

  try {
    console.log(`Compiling template for key: ${key}...`);
    const source = getContractSource(type, options);

    const input = {
      language: 'Solidity',
      sources: { [sourceFileName]: { content: source } },
      settings: {
        outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } },
        optimizer: { enabled: true, runs: 200 },
      },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    if (output.errors && output.errors.some(e => e.severity === 'error')) {
      const errorMessages = output.errors.filter(e => e.severity === 'error').map(e => e.formattedMessage).join('\n');
      throw new Error('Compilation failed:\n' + errorMessages);
    }

    const contract = output.contracts[sourceFileName][contractName];
    precompiledContracts[key] = {
      abi: contract.abi,
      bytecode: '0x' + contract.evm.bytecode.object,
    };

    console.log(`✅ Successfully compiled ${key}`);
  } catch (error) {
    console.error(`❌ Error compiling ${key}:`, error.message);
  }
});

const outputPath = path.resolve(__dirname, '..', 'workers', 'src', 'precompiled-contracts.json');
fs.writeFileSync(outputPath, JSON.stringify(precompiledContracts, null, 2));

console.log(`\n🎉 Precompiled contracts saved to ${outputPath} (${Object.keys(precompiledContracts).length} contracts)`);
