import { useRedux } from "@/hooks";
import classnames from "classnames";
import { request } from "@/utils";

export default function Footer() {
  const { store, dispatch } = useRedux();

  const { ing, play } = store;

  const getArtist = (data: any[]) => {
    return data
      .map((item) => item.name)
      .reduce((item, str) => {
        return `${item} / ${str}`;
      });
  };

  const onplay = () => {
    // if (ing.src) return dispatch({ type: "CHANGE_PlAY", payload: !play });
    // request.get("/song/url", { params: { id: ing.id } }).then((res) => {
    //   dispatch({
    //     type: "CHANGE_ING",
    //     payload: { ...ing, src: res.data[0].url },
    //   });
    //   dispatch({ type: "CHANGE_PlAY", payload: !play });
    // });
    // audio.src = ing.url;

    // audio.play();

    dispatch({ type: "CHANGE_PlAY", payload: !play });
  };

  if (!ing.name) return null;

  return (
    <div className="audioBar">
      <img
        className={classnames("avatar", {
          "animation-stop": !play,
        })}
        src={ing.al?.picUrl}
      />
      <div className="info">
        <span>{ing.name}</span> - <span>{getArtist(ing.ar)}</span>
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
