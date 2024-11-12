const { ForgeConfig } = require("@electron-forge/maker-squirrel");

module.exports = {
  packagerConfig: {
    asar: true, // Puedes cambiar a 'false' si necesitas acceso directo a los archivos
    executableName: 'nutria', // Nombre de tu ejecutable
    icon: './public/logo.ico' // Ruta a tu icono (si tienes uno)
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // Configuraciones específicas para el instalador de Windows
        name: 'nutria',
        setupExe: 'nutria.exe', // Nombre del archivo .exe
        // Más configuraciones aquí...
      },
    },
    // Elimina el maker-zip ya que no es necesario para Windows
  ],
};