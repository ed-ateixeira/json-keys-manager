import fs from "fs";

const DATA_FROM_PATH = "./data.json";
const DATA_TO_PATH = "./new_data.json";

type ReaderCallback = (err: NodeJS.ErrnoException | null, data: string) => void;
type DefaultObject = Record<string, any>;

function reader(path: string, callback: ReaderCallback) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      return callback(err, data);
    }

    callback(null, data);
  });
}

function writer(path: string, data: DefaultObject) {
  fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
    if (err) throw new Error(`Error writing file: ${err.message}`);
  });
}

// TODO
function manager(data: DefaultObject) {
  return data;
}

reader(DATA_FROM_PATH, (err, data) => {
  if (err) {
    throw new Error(`Error reading file: ${err.message}`);
  }

  writer(DATA_TO_PATH, manager(JSON.parse(data)));
});
