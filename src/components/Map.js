import { RenderAfterNavermapsLoaded, NaverMap, Marker } from "react-naver-maps";
import "../style/Map.scss"

const Naver_Client_ID = "rsz0mhfl25";

function NaverMapAPI() {
    const navermaps = window.naver.maps;

    return (
      <NaverMap
        mapDivId={"maps-getting-started-uncontrolled"}
        style={{
          width: "500px", // 네이버지도 가로 길이
          height: "300px" // 네이버지도 세로 길이
        }}
        defaultCenter={{ lat: 37.551229, lng: 126.988205 }}
        defaultZoom={13}
        >
        <Marker
            key={1}
            position={new navermaps.LatLng(37.551229, 126.988205)}
            animation={0}
            onClick={() => {alert("여기는 N서울타워입니다.");}}
        />
      </NaverMap>
    );
  }

  function RenderMaps() {
      return (
        <div className="NaverMap" style={{display: "inline-block", margin: "100px"}}>
          <RenderAfterNavermapsLoaded
          ncpClientId={Naver_Client_ID} // 자신의 네이버 계정에서 발급받은 Client ID
          error={<p>Maps Load Error</p>}
          loading={<p>Maps Loading...</p>}
          >
          <NaverMapAPI />
          </RenderAfterNavermapsLoaded>
        </div>
      );
  }

  export default RenderMaps;