import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const CompanyWrapper = styled.div`
  background-color: #d7e9b9;
  width: 90%;
  margin-top: 13px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
  height: 115px;
  border-radius: 10px;
  overflow: scroll;
`;

const Wrapper = styled.div`
  .sym {
    background-color: #fff;
    display: inline-block;
    margin: 5px;
    padding: 5px;
    border-radius: 10px;
  }
`;

const CompanyCount = () => {
  const { cnData } = useSelector((state) => state.data);
  useEffect(() => {
    const CnEng = [
      'asan',
      'cheonan',
      'yesan',
      'gongju',
      'gyeryong',
      'geumsan',
      'nonsan',
      'buyeo',
      'dangjin',
      'seosan',
      'taean',
      'hongseong',
      'cheongyang',
      'boryeong',
      'seocheon',
    ];
    if (cnData !== null) {
      CnEng.map((v, i) => {
        const $countList = document.querySelector('#countList');
        const node = document.createElement('div');
        const text = document.createTextNode(
          `${CnEng[i]}: ${cnData['CnDivision'][CnEng[i]].length}`
        );

        node.appendChild(text);
        node.className = 'sym';
        $countList.appendChild(node);
      });
    }
  }, [cnData]);
  return (
    <CompanyWrapper>
      <Wrapper id='countList'></Wrapper>
    </CompanyWrapper>
  );
};

export default CompanyCount;
