import styled from 'styled-components';

// styled
export const MapWrapper = styled.div`
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
export const ButtonWrapper = styled.div`
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
export const PointInfoWrapper = styled.div`
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
export const InfoWrapper = styled.div``;
// End styled