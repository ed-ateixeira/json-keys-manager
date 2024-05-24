import fs from "fs";
import { StringUtils } from "../utils";

type ReaderCallback = (err: NodeJS.ErrnoException | null, data: string) => void;
type DefaultObject = Record<string, any>;

export class JSONManager {
  private from: string;
  private to: string;
  private new_data: DefaultObject;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
    this.new_data = {};

    this.reader((err, data) => {
      if (err) {
        throw new Error(`Error reading file: ${err.message}`);
      }

      this.writer(this.manager(JSON.parse(data)));
    });
  }

  private reader(callback: ReaderCallback) {
    fs.readFile(this.from, "utf8", (err, data) => {
      if (err) {
        return callback(err, data);
      }

      callback(null, data);
    });
  }

  private writer(data: DefaultObject) {
    fs.writeFile(this.to, JSON.stringify(data, null, 2), (err) => {
      if (err) throw new Error(`Error writing file: ${err.message}`);
    });
  }

  private uncapitalize_object(object: DefaultObject) {
    const new_object: DefaultObject = {};

    for (const [key, value] of Object.entries(object)) {
      const uncapitalized_key = StringUtils.uncapitalize(key);

      if (Array.isArray(value)) {
        new_object[uncapitalized_key] = this.uncapitalize_array(value);
      } else if (typeof value === "object" && value !== null) {
        new_object[uncapitalized_key] = this.uncapitalize_object(value);
      } else {
        new_object[uncapitalized_key] = value;
      }
    }

    return new_object;
  }

  private uncapitalize_array(array: Array<DefaultObject | string>) {
    return array.map((item) =>
      typeof item === "object" && item !== null
        ? this.uncapitalize_object(item)
        : item
    );
  }

  private manager(data: DefaultObject) {
    for (const [key, value] of Object.entries(data)) {
      const uncapitalized_key = StringUtils.uncapitalize(key);

      const isArray = Array.isArray(value);
      const isObject = typeof value === "object" && value !== null;

      if (isArray) {
        this.new_data[uncapitalized_key] = this.uncapitalize_array(value);
      } else if (isObject) {
        this.new_data[uncapitalized_key] = this.uncapitalize_object(value);
      } else {
        this.new_data[uncapitalized_key] = value;
      }
    }

    return this.new_data;
  }
}
