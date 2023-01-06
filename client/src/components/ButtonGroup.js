import React from 'react';

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

  const createBtn = (city, i) => {
    return (
      <button key={i} className={`${code}_${i}`}>
        {city}
      </button>
    );
  };

  return (
    <>
      <div id='group'>
        {city.map((v, i) => {
          return createBtn(v, i, code);
        })}
      </div>
    </>
  );
};

export default ButtonGroup;
