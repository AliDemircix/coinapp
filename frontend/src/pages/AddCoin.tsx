import { Button, Stack, TextField } from "@mui/material"
import { CoinList, addCoin } from "../api/coinsServices"
import { useState } from "react"
import useAlert from "../hooks/useAlert";
import { useNavigate } from "react-router-dom";
import * as Paths from "../Paths";

export const initialState = {
    name: "",
    amount: 0.11,
    price: 0.11
}
export const AddCoin = () => {
    const { setAlert } = useAlert();
    let navigate = useNavigate();
 
    const [coinForm, setCoinForm] = useState<CoinList>(initialState)
    console.log(coinForm)
    return <>
        <Stack>
            <TextField
                sx={{ mt: 2 }}
                size="small"
                id="name"
                label="Add Coin Name"
                value={coinForm.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCoinForm({ ...coinForm, name: event.target.value });
                }}
            />
            <TextField
                sx={{ mt: 2 }}
                size="small"
                id="price"
                label="Add Price"
                type="number"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCoinForm({ ...coinForm, price: parseFloat(event.target.value) });
                }}
            />
            <TextField
                sx={{ mt: 2 }}
                size="small"
                type="number"
                id="amount"
                label="Add Amount"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCoinForm({ ...coinForm, amount: parseFloat(event.target.value) });
                }}
            />
            <Button sx={{ ml: "auto", mt: 2 }} variant="outlined" onClick={()=> {addCoin(coinForm).then(res=> 
                {
                    setAlert("Coin Successfully Added","success");
                    navigate(Paths.coins.path)
                })}}>Add</Button>
        </Stack>

    </>
}