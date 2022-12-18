import { useRedux } from "@/hooks";
import classnames from "classnames";
import { request } from "@/utils";

export default function Footer() {
  const { store, dispatch } = useRedux();

  const { ing, play } = store;

  const getArtist = (data: any[]) => {
    if (!data.length) return;
    if (data.length < 2) return data[0].name;

    return data.reduce((item, str) => {
      return str.name + ` / ${item.name}`;
    });
  };

  const onplay = () => {
    request.get("/song/url", { params: { id: ing.id } }).then((res) => {
      dispatch({ type: "CHANGE_PlAY", payload: !play });
      dispatch({
        type: "CHANGE_ING",
        payload: { ...ing, src: res.data[0].url },
      });
    });
  };

  if (!ing.name) return null;

  return (
    <div className="audioBar">
      <img className="avatar" src={ing.pic}></img>
      <div className="info">
        <span>{ing.name}</span> -{" "}
        <span>{ing.ar ? getArtist(ing.ar) : getArtist(ing.artists)}</span>
      </div>
      <span
        className={classnames("iconfont", {
          "icon-bofang": !play,
          "icon-zanting": play,
        })}
        onClick={onplay}
      ></span>
    </div>
  );
}
