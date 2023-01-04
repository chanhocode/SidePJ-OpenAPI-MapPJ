import React from 'react';
import styled from 'styled-components';

const ButtonGroup = ({ code, division }) => {
  const city = [
    '아산시',
    '천안시',
    '예산군',
    '공주시',
    '계룡시',
    '금산군',
    '논산시',
    '부여군',
    '당진시',
    '서산시',
    '태안군',
    '홍성군',
    '청양군',
    '보령시',
    '서천군',
  ];
  // const CnEng = [
  //   'asan',
  //   'cheonan',
  //   'yesan',
  //   'gongju',
  //   'gyeryong',
  //   'geumsan',
  //   'nonsan',
  //   'buyeo',
  //   'dangjin',
  //   'seosan',
  //   'taean',
  //   'hongseong',
  //   'cheongyang',
  //   'boryeong',
  //   'seocheon',
  // ];
  const createBtn = (city, i) => {
    return (
      <>
        <button className={`${code}_${i}`}>{city}</button>
      </>
    );
  };

  return (
    <>
      <div id='group'>
        {city.map((v, i) => {
          // console.log(v);
          return createBtn(v, i, code);
        })}
      </div>
    </>
  );
};

export default ButtonGroup;
