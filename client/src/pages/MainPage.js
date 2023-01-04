import React, { useEffect, useState } from 'react';
import CompanyCount from '../components/CompanyCount';

import Map from '../components/Map';

const MainPage = () => {
  return (
    <>
      <Map />
      <CompanyCount />
    </>
  );
};
export default MainPage;
