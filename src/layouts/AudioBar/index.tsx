import { useBoolean, useMount, useRedux } from "@/hooks";
import { getArtist } from "@/utils";
import classnames from "classnames";
import Player from "./Player";

export default function AudioBar() {
  const [visible, on, off] = useBoolean(false);

  const { store, dispatch } = useRedux();

  const { ing, play } = store;

  useMount(() => {
    dispatch({ type: "CHANGE_AUDIO", payload: new Audio() });
  });

  const onplay = (e) => {
    e.stopPropagation();
    dispatch({ type: "CHANGE_PlAY", payload: !play });
  };

  if (!ing.name) return null;

  return (
    <>
      <div className="audioBar" onClick={on}>
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

      {visible && <Player onBack={off} />}
    </>
  );
}
