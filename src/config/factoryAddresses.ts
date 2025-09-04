// Mapeo de Chain ID a la dirección del contrato AirdropFactory desplegado
// Es necesario desplegar el AirdropFactory.sol en cada red que se quiera soportar
// y añadir la dirección resultante aquí.

interface FactoryAddresses {
  [chainId: number]: `0x${string}`;
}

export const airdropFactoryAddresses: FactoryAddresses = {
  // Ejemplo para Hardhat local network
  31337: '0x5FbDB2315678afecb367f032d93F642f64180aa3',

  // Ejemplo para Sepolia Testnet (reemplazar con la dirección real cuando se despliegue)
  11155111: '0x...SEPOLIA_FACTORY_ADDRESS',

  // Ejemplo para Ethereum Mainnet (reemplazar con la dirección real cuando se despliegue)
  1: '0x...MAINNET_FACTORY_ADDRESS',
  8453: '0xBb42EcDf41187e20225A7d7A70d3BA0994dFE952', // Base Mainnet
  10: '0x...OPTIMISM_MAINNET_FACTORY_ADDRESS',
  42161: '0x...ARBITRUM_MAINNET_FACTORY_ADDRESS',
  10143: '0x81E665A2D9099C726071566E0a2061DB28E82701',
  
  // Añadir más redes aquí...
};
