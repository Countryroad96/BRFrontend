import { RenderAfterNavermapsLoaded, NaverMap, Marker } from "react-naver-maps";
import "../style/Map.scss"

const Naver_Client_ID = "rsz0mhfl25";

function NaverMapAPI(props) {
    const navermaps = window.naver.maps;

    console.log(props.location.latitude, props.location.longitude);

    return (
      <NaverMap
        mapDivId={"maps-getting-started-uncontrolled"}
        style={{
          width: "500px", // 네이버지도 가로 길이
          height: "300px" // 네이버지도 세로 길이
        }}
        defaultCenter={{ lat: props.location.latitude, lng: props.location.longitude }}
        defaultZoom={17}
        >
        <Marker
            key={1}
            position={new navermaps.LatLng(props.location.latitude, props.location.longitude)}
            animation={0}
        />
      </NaverMap>
    );
  }

  function RenderMaps(props) {
      return (
        <div className="NaverMap">
          <RenderAfterNavermapsLoaded
          ncpClientId={Naver_Client_ID} // 자신의 네이버 계정에서 발급받은 Client ID
          error={<p>Maps Load Error</p>}
          loading={<p>Maps Loading...</p>}
          >
          <NaverMapAPI location={{longitude: props.location.longitude, latitude: props.location.latitude}}/>
          </RenderAfterNavermapsLoaded>
          <div>
          
          </div>
        </div>
      );
  }

  export default RenderMaps;