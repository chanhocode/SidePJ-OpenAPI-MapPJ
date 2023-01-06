import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CompanyCount from '../components/CompanyCount';
import Map from '../components/Map';

const MainPage = () => {
  const navigate = useNavigate();
  const { me } = useSelector((state) => state.data);
  useEffect(() => {
    if (!me) {
      navigate('/');
    }
    console.log('MainPage: ', me);
  }, []);
  return (
    <>
      <Map />
      <CompanyCount />
    </>
  );
};
export default MainPage;
