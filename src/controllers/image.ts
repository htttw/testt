import fs from "fs";
import config from "../utils/config";
import { apiInstance } from "../utils/api";

const loadImage = async (req: any, res: any) => {
  const storeGet = req.params.store;
  const storeHeaders: any = req.headers.store;
  let folterStore: any = null;

  storeGet == null ? (folterStore = storeHeaders) : (folterStore = storeGet);

  if (parseInt(folterStore) <= 9) {
    folterStore = `0${folterStore}`;
  }
  const routeFile = `input/${folterStore}`;

  fs.mkdirSync(routeFile, { recursive: true });

  let newFile = await fs.promises.readdir(routeFile);

  const imagesList = newFile.map((mapItem: any, index: number) => {
    return { id: index, name: mapItem };
  });

  res.json(imagesList);
};

const getAllStore = async (req: any, res: any) => {
  const { data } = await apiInstance(
    config.serverElParron,
    config.apiKeyElParron
  ).get(`/store/getAll`);
  res.json(data);
};

const updateImage = async (req: any, res: any) => {
  const { dataImage, store } = req.body;

  let folterStore: any = store;

  if (parseInt(folterStore) <= 9) {
    folterStore = `0${folterStore}`;
  }

  const routeFile = `input`;

  let newFile = await fs.promises.readdir(routeFile + "/" + folterStore);

  let arrayDelete: any = [];
  newFile.forEach((mapItem: any) => {
    if (!dataImage.some((objeto: any) => objeto.name === mapItem)) {
      arrayDelete.push(mapItem);
    }
  });

  await Promise.all(
    arrayDelete.map(async (archivo: any) => {
      await fs.promises.unlink(`input/${folterStore}/${archivo}`);
    })
  );
  await Promise.all(
    dataImage.map(async (mapItem: any, index: number) => {
      await fs.promises.rename(
        `input/${folterStore}/${mapItem.name}`,
        `input/${folterStore}/_${mapItem.name}`
      );
    })
  );

  await Promise.all(
    dataImage.map(async (mapItem: any, index: number) => {
      let nameNum = `0${index}`;
      if (index > 9) {
        nameNum = `${index}`;
      }

      await fs.promises.rename(
        `input/${folterStore}/_${mapItem.name}`,
        `input/${folterStore}/${nameNum}.jpg`
      );
    })
  ); 

  newFile = await fs.promises.readdir(routeFile + "/" + folterStore);

  res.json(
    newFile.map((mapItem: any, index: number) => {
      return { id: index, name: mapItem };
    })
  );
};

const updateStore = async (req: any, res: any) => {
  const routeFile = "input";

  let newFile = await fs.promises.readdir(routeFile);

  const imagesList = newFile.map((mapItem: any, index: number) => {
    return { id: index, name: mapItem };
  });

  res.json(imagesList); 
  const { data } = await apiInstance(
    config.serverElParron,
    config.apiKeyElParron
  ).get(`/store/getAll`);
  res.json(data);
};

const sendImageUsers = async (io: any, data: any) => {

  let storeFolder:any = data;
  if(storeFolder<=9){
    storeFolder= `0${storeFolder}`
  }

  const routeFile = `input/${storeFolder}`;
  let newFile = await fs.promises.readdir(routeFile);

  
  const imagesList = newFile.map((mapItem: any, index: number) => {
    return { id: index, name: mapItem };
  });
  let dataSendUser = { idStore: data, arrayImage: imagesList };



  io.emit("sendImageUsers", dataSendUser);
};

export { loadImage, updateImage, getAllStore, updateStore, sendImageUsers };
