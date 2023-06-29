import fs from "fs";

const numbName = async () => {

  const carpeta = "input";
    const archivos = await fs.promises.readdir(carpeta);

    let name = 0;
    if (archivos.length !== 0) {
      name = archivos.length + 1;
    }
    return name;
  
};

export { numbName };
