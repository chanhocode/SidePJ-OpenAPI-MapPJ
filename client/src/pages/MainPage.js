import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CompanyCount from '../components/CompanyCount';
import Map from '../components/Map/Map';

const MainPage = () => {
  const navigate = useNavigate();
  const { me } = useSelector((state) => state.data);

  // store에 me의 유무를 확인 하고 me 가 없다면 인적사항 페이지로 이동
  useEffect(() => {
    if (!me) {
      navigate('/');
    }
  }, [me, navigate]);

  return (
    <>
      <Map />
      <CompanyCount />
    </>
  );
};
export default MainPage;
