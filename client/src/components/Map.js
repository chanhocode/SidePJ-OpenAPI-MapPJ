import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { CNcity, CnLocation } from '../api/chungnam';
import geojson from '../api/TL_SCCO_SIG.json';
import EupMyeonDong from '../api/HJD.json';

import ButtonGroup from './ButtonGroup';
import { CN_DATA_LOAD_REQUEST, SAVE_DATA_REQUEST } from '../reducers/data';

// styled
const MapWrapper = styled.div`
  width: 600px;
  display: flex;
  @media (max-width: 600px) {
    width: 100%;
  }
  .map-details-info {
    button {
      margin-right: 10px;
      margin-bottom: 10px;
    }
    padding: 10px;
    width: 350px;
    td {
      padding: 2px;
    }
  }
  .map-info {
    padding: 10px;
    width: 350px;
    button {
      margin-right: 10px;
      margin-bottom: 10px;
    }
    td {
      padding: 2px;
    }
  }
`;
const ButtonWrapper = styled.div`
  #group {
    display: flex;
    flex-direction: column;
  }
  button {
    width: 100px;
    height: 31px;
    @media (max-width: 600px) {
    }
  }
`;
const PointInfoWrapper = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #e2e2e2;
  border-bottom: 2px solid #000;

  button {
    display: block;
    position: relative;
    float: left;
    width: 120px;
    height: 40px;
    padding: 0;
    margin-left: 10px;
    font-weight: 600;
    text-align: center;
    color: #fff;
    border: none;
    border-radius: 5px;
    transition: all 0.2s;
    cursor: pointer;
  }
  #startPoint.btnFade {
    background: #00ae68;
  }
  #startPoint.btnFade:hover {
    background: #21825b;
  }
  #startPoint.selection {
    background: #5dc8cd;
  }
  #startPoint.selection:hover {
    background: #01939a;
  }

  #removePoint {
    background: #a74982;
  }
  #removePoint.btnFade:hover {
    background: #6d184b;
  }
  #lineDistance {
    background-color: #fff;
    width: 52%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    margin-right: 10px;
  }
`;
const InfoWrapper = styled.div``;
// End styled

const Map = () => {
  const { kakao } = window;
  const { me } = useSelector((state) => state.data);
  const dispatch = useDispatch();

  // 데이터를 불러오는 작업이 중복 되지 않게 하는 flag변수
  let flag = true;

  // 도시별 분류를 위한 저장소
  const CnDivision = {
    asan: [],
    cheonan: [],
    yesan: [],
    gongju: [],
    gyeryong: [],
    geumsan: [],
    nonsan: [],
    buyeo: [],
    dangjin: [],
    seosan: [],
    taean: [],
    hongseong: [],
    cheongyang: [],
    boryeong: [],
    seocheon: [],
  };

  /**
   * 주소를 '시' 별로 구분하여 분류한다.
   * @param {*} state
   */
  const dataSet = (state) => {
    state.data.data.map((v) => {
      const city = CNcity[v['소재지'].slice(0, 3)];
      CnDivision[city].push(v);
      return 0;
    });
  };

  /**
   * 공공데이터포털의 openAPI에서 필요 데이터를 불러온 뒤, 도시별로 분류 하여 store에 저장한다.
   */
  const fetchData = async () => {
    try {
      const request = await axios.get(process.env.REACT_APP_CHUNGNAM_API);
      dataSet(request);
      dispatch({
        type: CN_DATA_LOAD_REQUEST,
        data: { CnDivision },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 데이터 분류
  useEffect(() => {
    if (flag) {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      flag = false;
    }
  }, [flag]);

  // 카카오맵 셋팅
  useEffect(() => {
    // 시군구
    let data = geojson.features; // 해당 구역 이름, 좌표 등
    let coordinates = []; // 좌표 저장
    let name = ''; // 행정구 이름

    let polygons = [];

    // 읍면동
    let EmdData = EupMyeonDong.features; // 해당 구역 이름, 좌표 등
    let EmdCoordinates = []; // 좌표 저장
    let EmdName = ''; // 읍면동 이름

    /**
     * 초기값 false (화면 버튼을 눌러도 동작하지 않게 설정)
     * 폴리곤 클릭시 true로 변경하여 화면 버튼을 활성화
     * 화면 버튼 클릭시 false로 스위치
     */
    let lenSw = false;

    // 선

    const container = document.getElementById('kakaoMap');
    const options = {
      center: new kakao.maps.LatLng(36.545300108494835, 126.88998078116987),
      level: 11,
    };
    const map = new kakao.maps.Map(container, options);

    const customOverlay = new kakao.maps.CustomOverlay({});

    // 폴리곤 내에서 드래그를 막고자 하는 변수
    let draggable = true;

    /**
     * 클릭한 폴리곤의 중심값을 구하는 함수
     * @param {*} points
     * @returns
     */
    const centroid = (points) => {
      let i, j, len, p1, p2, f, area, x, y;

      area = x = y = 0;

      for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
        p1 = points[i];
        p2 = points[j];

        f = p1.y * p2.x - p2.y * p1.x;
        x += (p1.x + p2.x) * f;
        y += (p1.y + p2.y) * f;
        area += f * 3;
      }

      let xarea = x / area;
      let yarea = y / area;
      return new kakao.maps.LatLng(xarea, yarea);
    };

    /**
     * 폴리곤을 클릭시 생성된 폴리곤을 모두 지우는 함수.
     * @param {*} polygons
     */
    const deletePolygon = (polygons) => {
      for (let i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
      }
      polygons = [];
      lenSw = true;
    };

    let markers = []; // 생선된 마커를 담는다.
    let info = []; // 생성된 infoWindow를 담는다.

    /**
     * 문자열 괄호 문자 제거 함수
     * @param {*} s
     * @returns
     */
    function removeParentheses(s) {
      let item;
      let stack = [];
      for (let x of s) {
        if (x === ')') {
          //여는괄호(자신의 짝)까지 pop
          while (stack.pop() !== '('); //'('까지 pop하고 거짓이 됨-> 반복문 중단
        } else stack.push(x); //닫는 괄호가 아닐 때는 push
      }
      //console.log(stack); //배열의 형태로 들어가있음 ['a', 'b', 'c']
      item = stack.join(''); //string으로 합쳐줌
      return item;
    }

    /**
     * 기업정보 검색
     * @param {string} company
     * @param {string} address
     * @returns
     */
    const searchCompany = async (company, address) => {
      try {
        console.log('search company: ', company);
        let newCompany = company;
        console.log('search newCompany: ', newCompany);
        const check = company.indexOf('㈜');
        if (check !== -1) {
          console.log('(주) 있음.');
          const test = newCompany.replace('㈜', '');
          newCompany = test;
          console.log('(주)제거: ', newCompany);
        }
        const search = await axios.get(
          process.env.REACT_APP_SEARCH_API + `${newCompany}`
        );
        //
        console.log('search: ', search.data.response.body.items.item);
        const item = search.data.response.body.items.item.find((v) => {
          const sItem = removeParentheses(v.enpBsadr.replace('충청남도 ', ''));
          return sItem.replace(/ /g, '') === address.replace(/ /g, '');
        });
        return item;
      } catch (error) {
        console.log(error);
      }
    };

    /**
     * 정보에 따른 콘텐츠 내용 정의
     * @param {object} v
     * @returns
     */
    const createContent = async (v) => {
      try {
        const searchMore = await searchCompany(v['업체명'], v['소재지']);
        console.log('searchMore', searchMore);
        const content = searchMore
          ? `
            <div class='map-details-info'>
              <div id="infoBtnGroup">
                <button id="btnClick">Interest</button>
                <a href="https://www.google.com/search?q=${v['업체명']}" target="_blank" >
                  <button id="btnClick">Search</button>
                </a>
              </div>
              <table>
                <tr>
                  <td>업체명</td>
                  <td>${v['업체명']}</td>
                </tr>
                <tr>
                  <td>영문</td>
                  <td>${searchMore['corpEnsnNm']}</td>
                </tr>
                <tr>
                  <td>대표자</td>
                  <td>${searchMore['enpRprFnm']}</td>
                </tr>
                <tr>
                  <td>전화번호</td>
                  <td>${searchMore['enpTlno']}</td>
                </tr>
                <tr>
                  <td>소재지</td>
                  <td>${v['소재지']}</td>
                </tr>
                <tr>
                  <td>주생산품</td>
                  <td>${v['주생산품']}</td>
                </tr>
                <tr>
                  <td>법인등록번호</td>
                  <td>${searchMore['crno']}</td>
                </tr>
                <tr>
                  <td>기업설립일자</td>
                  <td>${searchMore['enpEstbDt']}</td>
                </tr>
              </table>
            </div>
            `
          : `
              <div class="map-info">
                <div id="infoBtnGroup">
                  <button id="btnClick">Interest</button>
                  <a href="https://www.google.com/search?q=${v['업체명']}" target="_blank" >
                    <button id="btnClick">Search</button>
                  </a>
                </div>
                <table>
                  <tr>
                    <td>업체명</td>
                    <td>${v['업체명']}</td>
                  </tr>
                  <tr>
                    <td>소재지</td>
                    <td>${v['소재지']}</td>
                  </tr>
                  <tr>
                    <td>주생산품</td>
                    <td>${v['주생산품']}</td>
                  </tr>
                </table>
              </div>
              `;
        return content;
      } catch (err) {
        console.log(err);
      }
    };

    /**
     * 클릭한 폴리곤에 해당하는 지역의 기업을 마커로 표시한다.
     * @param {*} city
     */

    const createMarker = (city) => {
      CnDivision[CNcity[city]].map((v) => {
        var geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(v['소재지'], function (result, status) {
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            /**
             * - 클릭한 기업을 DB에 저장 및 인적사항 연계
             * - 열려있는 infoWindow를 close한다.
             */
            const onSaveLike = () => {
              if (info) {
                for (let i = 0; i < info.length; i++) {
                  info[i].close();
                }
              }
              console.log('me: ', me);
              dispatch({
                type: SAVE_DATA_REQUEST,
                data: {
                  meId: me.id,
                  do: '충청남도',
                  si: v['소재지'].slice(0, 3),
                  name: v['업체명'],
                  address: v['소재지'],
                  product: v['주생산품'],
                },
              });
            };

            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
              map: map,
              position: coords,
            });
            markers.push(marker);
            map.setCenter(coords);

            // 마커에 클릭이벤트를 등록합니다
            kakao.maps.event.addListener(marker, 'click', async (event) => {
              if (info) {
                console.log('info: ', info);
                for (let i = 0; i < info.length; i++) {
                  info[i].close();
                }
              }
              // 마커 위에 인포윈도우를 표시합니다
              try {
                const data = await createContent(v);
                var iwContent = data,
                  iwRemoveable = true;

                // 인포윈도우를 생성합니다
                var infowindow = new kakao.maps.InfoWindow({
                  content: iwContent,
                  removable: iwRemoveable,
                });
                info.push(infowindow);
                infowindow.open(map, marker);
                const infoBtn = document.querySelector('#btnClick');
                infoBtn.onclick = onSaveLike;

                // 목적지 지정 버튼 생성
                const $infoBtnGroup = document.querySelector('#infoBtnGroup');
                const endPointBtn = document.createElement('button');
                endPointBtn.innerHTML = 'endPoint';
                function onClickDistance() {
                  const endPointData = coords;

                  let polyline = new kakao.maps.Polyline({
                    path: [
                      new kakao.maps.LatLng(
                        startPointData['La'],
                        startPointData['Ma']
                      ),
                      new kakao.maps.LatLng(
                        endPointData['La'],
                        endPointData['Ma']
                      ),
                    ],
                    strokeWeight: 2,
                    strokeColor: '#FF00FF',
                    strokeOpacity: 0.8,
                    strokeStyle: 'solid',
                  });

                  polyline.setMap(map);

                  console.log('길이: ' + Math.round(polyline.getLength()));
                  const $lineDistance = document.querySelector('#lineDistance');
                  $lineDistance.textContent = `출발지점 -> 목적지(${
                    v['업체명']
                  }): ${Math.round(polyline.getLength())}M`;
                }

                endPointBtn.onclick = onClickDistance;
                $infoBtnGroup.append(endPointBtn);
              } catch (err) {
                console.log(err);
              }
            });
          }
        });
        return 0;
      });
    }; // end

    /**
     * 생성되어 있는 마커를 모두 제거한다.
     */
    const deleteMarker = () => {
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    };

    data.forEach((val) => {
      coordinates = val.geometry.coordinates;
      name = val.properties.SIG_KOR_NM;
      displayArea(coordinates, name);
    });

    function displayArea(coordinates, name, type) {
      let path = [];
      let points = [];

      coordinates[0].forEach((coordinate) => {
        let point = {};
        point.x = coordinate[1];
        point.y = coordinate[0];
        points.push(point);
        path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
      });

      // 구역 경계 생성
      let polygon;
      if (!type) {
        polygon = new kakao.maps.Polygon({
          map: map,
          path: path, // 그려질 다각형의 좌표 배열입니다
          strokeWeight: 2, // 선의 두께입니다
          strokeColor: '#004c80', // 선의 색깔입니다
          strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid', // 선의 스타일입니다
          fillColor: '#fff', // 채우기 색깔입니다
          fillOpacity: 0.4, // 채우기 불투명도 입니다
        });
      } else {
        polygon = new kakao.maps.Polygon({
          map: map,
          path: path, // 그려질 다각형의 좌표 배열입니다
          strokeWeight: 2, // 선의 두께입니다
          strokeColor: '#004c80', // 선의 색깔입니다
          strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid', // 선의 스타일입니다
          fillColor: '#fff', // 채우기 색깔입니다
          fillOpacity: 0.1, // 채우기 불투명도 입니다
        });
      }

      polygons.push(polygon);

      if (!type) {
        // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다
        // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
        kakao.maps.event.addListener(
          polygon,
          'mouseover',
          function (mouseEvent) {
            polygon.setOptions({ fillColor: '#09f' });
            draggable = false;
            map.setDraggable(draggable);
          }
        );

        // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다
        kakao.maps.event.addListener(
          polygon,
          'mousemove',
          function (mouseEvent) {
            customOverlay.setPosition(mouseEvent.latLng);
          }
        );

        // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
        // 커스텀 오버레이를 지도에서 제거합니다
        kakao.maps.event.addListener(polygon, 'mouseout', function () {
          draggable = true;
          map.setDraggable(draggable);

          polygon.setOptions({ fillColor: '#fff' });
          customOverlay.setMap(null);
        });
      }
      kakao.maps.event.addListener(polygon, 'click', function (mouseEvent) {
        draggable = true;
        map.setDraggable(draggable);
        if (type) {
          console.log('test');
          let level = 8;
          map.setLevel(level, {
            anchor: centroid(points),
            animate: {
              duration: 50, //확대 애니메이션 시간
            },
          });
          return;
        }
        let level = 10;
        map.setLevel(level, {
          anchor: centroid(points),
          animate: {
            duration: 50, //확대 애니메이션 시간
          },
        });

        // 기존 폴리곤을 지우고 읍면동 폴리곤 생성
        deletePolygon(polygons);
        EmdData.forEach((val) => {
          if (val.properties.sggnm === name) {
            EmdCoordinates = val.geometry.coordinates;
            EmdName = val.properties.sggnm;
            displayArea(EmdCoordinates, EmdName, 'type');
          }
        });
        createMarker(name);
      });
    }

    function setCenter() {
      // 이동할 위도 경도 위치를 생성합니다
      var moveLatLon = new kakao.maps.LatLng(
        36.545300108494835,
        126.88998078116987
      );
      map.setLevel(11, {
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      // 지도 중심을 이동 시킵니다
      map.setCenter(moveLatLon);
    }

    // 화면을 초기 값으로 초기화 한다.
    const $mapRerender = document.querySelector('#mapRerender');
    $mapRerender.addEventListener('mousedown', function () {
      setCenter();
      deletePolygon(polygons);
      if (lenSw) {
        data.forEach((val) => {
          coordinates = val.geometry.coordinates;
          name = val.properties.SIG_KOR_NM;
          displayArea(coordinates, name);
        });
        deleteMarker();
        lenSw = false;
      }
    });
    $mapRerender.addEventListener('mouseup', function () {
      setCenter();
    });
    // End 초기화

    // 폴리곤 클릭시 해당 지역으로 줌 하며, 생성되어 있는 폴리곤 제거한다.
    const $cn_0 = document.querySelector('.CN_0');
    $cn_0.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.807980592249244, 126.97807816423754),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '아산시') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('아산시');
    });
    const $cn_1 = document.querySelector('.CN_1');
    $cn_1.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.891335879739145, 127.15991121087959),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '천안시') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('천안시');
    });
    const $cn_2 = document.querySelector('.CN_2');
    $cn_2.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.671213587359205, 126.78316762176077),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '예산군') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('예산군');
    });
    const $cn_3 = document.querySelector('.CN_3');
    $cn_3.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.480131003402946, 127.07526448031712),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '공주시') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('공주시');
    });
    const $cn_4 = document.querySelector('.CN_4');
    $cn_4.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.296397333427386, 127.23409744683859),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '계룡시') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('계룡시');
    });
    const $cn_5 = document.querySelector('.CN_5');
    $cn_5.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.11949795655726, 127.47742758543411),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '금산군') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('금산군');
    });
    const $cn_6 = document.querySelector('.CN_6');
    $cn_6.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.191615069739605, 127.15959200216953),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '논산시') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('논산시');
    });
    const $cn_7 = document.querySelector('.CN_7');
    $cn_7.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.244859884660116, 126.85872075272363),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '부여군') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('부여군');
    });
    const $cn_8 = document.querySelector('.CN_8');
    $cn_8.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.903428540078245, 126.65288268343298),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '당진시') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('당진시');
    });
    const $cn_9 = document.querySelector('.CN_9');
    $cn_9.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.781013069041464, 126.46535097223789),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '서산시') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('서산시');
    });
    const $cn_10 = document.querySelector('.CN_10');
    $cn_10.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.76049320146857, 126.25971917973331),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '태안군') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('태안군');
    });
    const $cn_11 = document.querySelector('.CN_11');
    $cn_11.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.569773596198964, 126.62416591290733),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '홍성군') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('홍성군');
    });
    const $cn_12 = document.querySelector('.CN_12');
    $cn_12.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.4299449897745, 126.85043582326404),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '청양군') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('청양군');
    });
    const $cn_13 = document.querySelector('.CN_13');
    $cn_13.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        anchor: new kakao.maps.LatLng(36.34376024931412, 126.60358066491877),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '보령시') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('보령시');
    });
    const $cn_14 = document.querySelector('.CN_14');
    $cn_14.addEventListener('click', function () {
      deleteMarker();
      draggable = true;
      map.setDraggable(draggable);

      var level = 10;
      map.setLevel(level, {
        // anchor: new kakao.maps.LatLng(36.108670128072674, 126.70587754426815),
        anchor: new kakao.maps.LatLng(CnLocation['서천군']),
        animate: {
          duration: 50, //확대 애니메이션 시간
        },
      });
      deletePolygon(polygons);
      EmdData.forEach((val) => {
        if (val.properties.sggnm === '서천군') {
          EmdCoordinates = val.geometry.coordinates;
          EmdName = val.properties.sggnm;
          displayArea(EmdCoordinates, EmdName, 'type');
        }
      });
      createMarker('서천군');
    });
    // 위 코드와 동일 동작을 원하나 동작 오류 수정 필요.
    // let count = 0;
    // function cn_move(code, i) {
    //   const $code = document.querySelector(`.${code}_${i}`);
    //   $code.addEventListener('click', function () {
    //     deleteMarker();
    //     draggable = true;
    //     map.setDraggable(draggable);

    //     var level = 10;
    //     map.setLevel(level, {
    //       anchor: new kakao.maps.LatLng(CnLocation[Object.keys(CNcity)[i]]),
    //       animate: {
    //         duration: 50, //확대 애니메이션 시간
    //       },
    //     });
    //     let test = Object.keys(CNcity);

    //     console.log('atb', test[i]);

    //     deletePolygon(polygons);
    //     createMarker(Object.keys(CNcity)[i]);
    //   });
    // }

    // if (count < 15) {
    //   for (let i = 0; i < Object.keys(CNcity).length; i++) {
    //     console.log('for: ', i);
    //     cn_move('CN', i);
    //     count++;
    //   }
    // }
    // End

    // 선 생성 및 거리 측정

    // 출발지점 생성
    // 출발지점 마커 이미지 정의
    var imageSrc = './img/SPmarker.png', // 마커이미지의 주소입니다
      imageSize = new kakao.maps.Size(22, 36), // 마커이미지의 크기입니다
      imageOption = { offset: new kakao.maps.Point(10, 39) };
    var markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );
    // 마커 정의
    let SPmarker = new kakao.maps.Marker({ map: map, image: markerImage });

    const $startPoint = document.querySelector('#startPoint');
    const $removePoint = document.querySelector('#removePoint');

    let spFlag = false;
    let startPointData = '';
    $startPoint.addEventListener('click', onChangeSpFlag);
    $removePoint.addEventListener('click', onRemovePoint);

    function onChangeSpFlag() {
      spFlag = !spFlag;
      console.log(spFlag);
      if (spFlag === true) {
        $startPoint.textContent = '출발지점 확정';
        $startPoint.classList.replace('btnFade', 'selection');
      } else {
        $startPoint.textContent = '출발지점 재지정';
        $startPoint.classList.replace('selection', 'btnFade');
      }
    }
    function onRemovePoint() {
      console.log('remove Point');
      SPmarker.setMap(null);
    }

    kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
      console.log('event: ', spFlag);
      if (spFlag) {
        console.log('SpSet');

        // 클릭한 위도, 경도 정보를 가져옵니다
        let latlng = mouseEvent.latLng;
        startPointData = latlng;

        // // 마커 위치를 클릭한 위치로 옮깁니다
        SPmarker.setPosition(latlng);
        SPmarker.setMap(map);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PointInfoWrapper>
        <div>
          <button id='startPoint' className='btnFade'>
            출발지점 지정
          </button>
          <button id='removePoint' className='btnFade'>
            출발지점 삭제
          </button>
        </div>
        <div id='lineDistance'></div>
      </PointInfoWrapper>
      <MapWrapper>
        <div id='kakaoMap' style={{ width: '500px', height: '496px' }}></div>
        <ButtonWrapper>
          <button id='mapRerender'>화면</button>
          <ButtonGroup code={'CN'} />
        </ButtonWrapper>
      </MapWrapper>
      <InfoWrapper id='info'></InfoWrapper>
    </>
  );
};

export default Map;
