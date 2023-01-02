/*
  useReducer로 요청 상태 관리 
*/
import React, { useReducer, useEffect } from "react";
import axios from "axios";

/*
reduce 함수 만들어 줌 / LOADING, SUCCESS, ERROR

reducer함수 만들기 -상태를 업데이트 하는 함수(컴퍼넌트 밖에 있음)
상태를 변경하는 로직이 있는 함수
state - 현재 상태(숫자,문자,배열,객체..), 
action-dispatch에서 보낸 객체를 파라메터로 받아옴
컴포넌트 바깥에서 작성, 다른 파일로 불러오는 것도 가능
*/
function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return {
        loading: true,
        data: null,
        error: null,
      };
    case "SUCCESS":
      return {
        loading: false,
        data: action.data,
        error: null,
      };
    case "ERROR":
      return {
        loading: false,
        data: null,
        error: action.error,
      };
    default:
      throw new Error("액션 타입 없음");
  }
}

function Users() {
  // useReducer 사용 초기값 설정
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  });
  // state - 현재 상태, dispatch - 액션으로 보내는 함수
  // 첫번째 파라메터는 연결되는 함수명, 두번째 - 초기값

  const fetchUsers = async () => {
    // 아래 '' 값이 정해져 있음
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users",
      );
      dispatch({ type: "SUCCESS", data: response.data }); // 요청 성공
    } catch (e) {
      dispatch({ type: "ERROR", error: e }); // 요청 실패
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { loading, error, data: users } = state;
  //비구조할당, data를 users로 바꿔줌
  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러발생!!!</div>;
  if (!users) return null;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} (우편번호 : {user.address.zipcode})
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>다시 불러오기</button>
    </>
  );
}

export default Users;
