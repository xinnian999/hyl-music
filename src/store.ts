import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { pick } from "lodash";
import thunk from "redux-thunk";

export type isStore = {
  ing: any;
  play: boolean;
  audio: HTMLAudioElement;
  currentTime: number;
  list: any[];
};

//在localStorge中生成key为root的值
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["play", "currentTime"], //设置某个reducer数据不持久化，
};

const reducer = (
  state: isStore = {
    ing: { id: 0, name: "", ar: [], pic: "" },
    play: false,
    audio: new Audio(),
    currentTime: 0,
    list: [],
  },
  { type, payload }: any
) => {
  switch (type) {
    case "CHANGE_ING":
      return {
        ...state,
        ing: pick(payload, ["id", "name", "url", "al", "ar", "time", "lrc"]),
      };
    case "CHANGE_PlAY":
      return { ...state, play: payload };
    case "CHANGE_AUDIO":
      return { ...state, audio: payload };
    case "CHANGE_CURRENTTIME":
      return { ...state, currentTime: payload };
    case "CHANGE_LIST":
      return { ...state, list: payload };
    default:
      return state;
  }
};

const myPersistReducer = persistReducer(persistConfig, reducer);

const store = createStore(myPersistReducer, applyMiddleware(thunk));

const persistor = persistStore(store);

export { store, persistor };
