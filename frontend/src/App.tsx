import React,{ useState, useEffect, createRef } from 'react';
import './App.css';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AppHeader from './Components/AppHeader/AppHeaderDefault'
import CustomSelect from './Components/Fields/Select'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {UtilFireBase} from './Util/UtilFirebase';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import SelectMui, { SelectChangeEvent } from '@mui/material/Select';

const defaultProps = {
  //bgcolor: 'background.paper',
  //borderColor: 'text.primary',
  m: 1,
  //border: 1
};

interface AmountPerson {
  user: string
  payment: number
}

function App() {
  var [rows, setRowCount] = useState([1]);
  var [registUsers, setRegistUser] = useState([""]);
  var [error, setError] = useState(false);
  var [errorMsg, setErrorMsg] = useState("");
  var [amountPersonArr, setAmountPersonArr] = useState<AmountPerson[]>([]);
  
  function AddUser(): void {
    var inputUser = document.getElementById("input_user") as HTMLInputElement | null;
    var val = inputUser?.value!;
    if(val == ""){
      setError(true);
    } else {
      if(registUsers.includes(val)){
        errorMsg = "ユーザーは既に登録されいています。";
        setErrorMsg(errorMsg);
        setError(true);
      } else {
        //登録ユーザー設定
        registUsers.push(inputUser?.value!);
        setRegistUser([...registUsers]);
        //支払金額計用ユーザー
        var ap: AmountPerson = {
          user: inputUser?.value!,
          payment: 0
        };
        amountPersonArr.push(ap);
        setAmountPersonArr([...amountPersonArr]);
        
        //エラー解除
        setError(false);
      }
    }
  }

  function DeleteUser(): void {
    //未選択チェック
    if(deleteUser == ""){
      errorMsg =" 削除ユーザーを選択してください。";
      setErrorMsg(errorMsg);
      setError(true);
      return;
    }

    //使用中チェック
    var user_select = document.getElementsByClassName('user-select') as HTMLCollection || null;
    var selected = "";
    for(var i = 0; i < user_select?.length!; i++){
      selected = user_select![i]?.firstChild?.textContent as string | "";
      if(selected == deleteUser){
        errorMsg = "ユーザーは既に使用されています。削除できません。";
        setErrorMsg(errorMsg);
        setError(true);
        return;
      }
    }

    //削除処理
    //削除選択ユーザー
    setDeleteUser("");
    //登録用ユーザー
    var i = registUsers.findIndex(x => x == deleteUser);
    registUsers.splice(i,1);
    setRegistUser([...registUsers])
    //支払計算用ユーザー
    var j = amountPersonArr.findIndex(x => x.user == deleteUser);
    amountPersonArr.splice(j,1);
    setAmountPersonArr([...amountPersonArr]);
  }

  function AddAmountDetails(): void{
    rows.push(1);
    setRowCount([...rows]);
  }

  function DeleteAmountDetails(): void {
    var  accountRow = document.getElementsByClassName("AccountRow") as HTMLCollection | null;
    if(accountRow?.length! > 1){
      rows.pop();
      setRowCount([...rows]);
    }  
  }

  var [ammount, setAmmount] = useState(0);
  function CalcAmount(): void {
    if(amountPersonArr.length > 0){
      var blank = '<span class="notranslate">​</span>';
      var  accountRow = document.getElementsByClassName("AccountRow") as HTMLCollection | null;
      var userDetailAmmount = null;
      
      //合計金額計算
      ammount = 0;
      for(var i = 0; i < accountRow!.length; i++){
        userDetailAmmount = accountRow![i].querySelector('#user-detail-amount') as HTMLInputElement;
        ammount +=  parseInt(userDetailAmmount.value);
      }
      setAmmount(ammount);
  
      //基本金額の設定
      var avarage = Math.floor(ammount / amountPersonArr.length);
      for(var i = 0; i < amountPersonArr.length; i++){
        amountPersonArr[i].payment = avarage;
      }
      
      //割勘計算
      for(var i = 0; i < accountRow!.length; i++){
        var userSelecrt = accountRow![i].querySelector('.user-select') as HTMLElement;
        var user = userSelecrt!.firstChild!.textContent;
        console.log(user);
        
        if(masterUser != user){
          //明細金額取得
          var apIndex = amountPersonArr.findIndex(x => x.user == user);
          var ap = amountPersonArr[apIndex];
          userDetailAmmount = accountRow![i].querySelector('#user-detail-amount') as HTMLInputElement;
          ap.payment -= parseInt(userDetailAmmount.value);
          amountPersonArr[apIndex] = ap;
        }
      }
      setAmountPersonArr([...amountPersonArr]);
    }
  }

  //幹事ユーザー変更イベント
  var [masterUser, setMasterUser] = useState("");
  const UpdateMasterUser = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    masterUser = event.target.value;
    setMasterUser(masterUser);
    CalcAmount();
  };

  //削除ユーザー変更イベント
  var [deleteUser, setDeleteUser] = useState("");
  const UpdateDeleteUser = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    deleteUser = event.target.value;
    setDeleteUser(deleteUser);
  };

  //ダミーメソッド
  const Dummy = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
  };


  return (
    <div className="App">
      <AppHeader/>
      <Box sx={{height: '80px'}}></Box>
      <Container maxWidth="sm" >
        <Stack sx={{ width: '100%' }} spacing={2}>
          {error ?
          <Alert severity="error">{errorMsg}</Alert>
          : ''
          }
        </Stack>
        <Box borderRadius={3} {...defaultProps}>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 9">
              <TextField
                id="outlined-read-only-input"
                label="合計金額"
                defaultValue="0"
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  height: 80
                }}
          
                value={ammount}
              />
            </Box>
            <Box gridColumn="span 3">
              <Button onClick={CalcAmount} variant="outlined" size="large">
                金額計算
              </Button>
            </Box>
          </Box>
        </Box>
        
        <Box borderRadius={3} {...defaultProps}>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            {amountPersonArr.map((item,index) => (
              <Box gridColumn="span 3">
                <TextField
                  id="outlined-read-only-input"
                  label={item.user}
                  InputProps={{
                    readOnly: true,
                  }}
                  value={item.payment}
                  />
              </Box>
            ))}
          </Box>
        </Box>
        
        <Box sx={{height: '5px'}}></Box>
        <Box borderRadius={3} {...defaultProps}>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 10">
              <TextField 
                id="input_user"
                label="登録ユーザー名"
                type="Text"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: '100%' }}
              />  
            </Box>
            <Box gridColumn="span 2">
              <Button onClick={AddUser} variant="outlined" size="large">
                +
              </Button>
            </Box>
          </Box>
        </Box>
        
        <Box borderRadius={3} {...defaultProps}>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 10">
              <CustomSelect 
                onChange={(event: SelectChangeEvent<string>) => UpdateDeleteUser(event,event.target.value)} 
                id="delete-user-select" 
                className='delete-user-select' 
                title='削除ユーザー' 
                selectItems={registUsers}/>
            </Box>
            <Box gridColumn="span 2">
              <Button onClick={DeleteUser} variant="outlined" size="large">
                -
              </Button>
            </Box>
          </Box>
        </Box>
        
        <Box borderRadius={3} {...defaultProps}>
          <CustomSelect
            onChange={(event: SelectChangeEvent<string>) => UpdateMasterUser(event,event.target.value)} 
            id="user" 
            className='user-select' 
            title='幹事' 
            selectItems={registUsers}
          />
          {rows.map((row,index) => (
            <div className="AccountRow">
              <Box sx={{height: '5px'}}></Box>
              <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
                <Box gridColumn="span 5">
                  <CustomSelect 
                    onChange={(event: SelectChangeEvent<string>,child: React.ReactNode) => Dummy(event,event.target.value)}
                    id={'user-select-' + index} 
                    className='user-select' 
                    title='支払者' 
                    selectItems={registUsers}
                  />
                </Box>
                <Box gridColumn="span 5">
                  <TextField
                    id="user-detail-amount"
                    label="金額"
                    type="number"
                    className="user-detail-amount"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
                <Box gridColumn="span 1">
                  <Button onClick={AddAmountDetails} variant="outlined" size="large">
                    +
                  </Button>
                </Box>
                <Box gridColumn="span 1">
                  <Button onClick={DeleteAmountDetails} variant="outlined" size="large">
                    -
                  </Button>
                </Box>
                
              </Box>
              <Box sx={{height: '5px'}}></Box>
            </div>
          ))}
        </Box>
        
      </Container>
    </div>
  );
}

export default App;
