import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { JOIN_REQUEST } from '../reducers/data';

// styled
const Layout = styled.div`
  text-align: center;
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(/background.png);
  background-size: cover;
  overflow: hidden;
`;
const Wrapper = styled.div`
  margin-top: 40px;
  form {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background-color: #fff;
  }
  select {
    border: none;
    border-bottom: 1px #000 solid;
    width: 70px;
    text-align: center;
    height: 30px;
  }
  button {
    margin-left: 20px;
    border: none;
    border-bottom: 1px #000 solid;
    width: 70px;
    height: 30px;
    cursor: pointer;
  }
`;
// End styled

/**
 * 기본 인적사항 작성 하여 store 및 db에 데이터 저장하는 페이지
 * @returns
 */
const JoinPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.data);
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('10');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeAge = useCallback((e) => {
    setAge(e.target.value);
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeGender = useCallback((e) => {
    setGender(e.target.value);
  });

  // store에 me가 담겨있으면 메인페이지로 이동
  useEffect(() => {
    if (me) {
      navigate('/main');
    }
  }, [me, navigate]);

  /**
   * submit btn 클릭시 인적사항을 DB 및 store에 저장
   */
  const onSubmitForm = useCallback(
    (e) => {
      console.log('submit data: ', gender, age);
      e.preventDefault();
      dispatch({
        type: JOIN_REQUEST,
        data: {
          age,
          gender,
        },
      });
    },
    [gender, age, dispatch]
  );
  return (
    <Layout>
      <Wrapper>
        <h1>Hello, Enter your information and Proceed.</h1>
        <form onSubmit={onSubmitForm}>
          <select type='gender' onChange={onChangeGender}>
            <option value='male'>남성</option>
            <option value='female'>여성</option>
          </select>
          <select type='age' onChange={onChangeAge}>
            <option value='10'>10대</option>
            <option value='20'>20대</option>
            <option value='30'>30대</option>
            <option value='40'>40대</option>
            <option value='50'>50대</option>
            <option value='60'>60대</option>
            <option value='70'>70대</option>
          </select>
          <button type='submit'>Go!</button>
        </form>
      </Wrapper>
    </Layout>
  );
};

export default JoinPage;
