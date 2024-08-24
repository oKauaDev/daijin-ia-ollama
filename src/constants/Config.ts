interface Config {
  mode: "development" | "production";
  port: number;
}

const Config: Config = {
  mode: "production",
  port: 3000,
};

export default Config;
