import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getCookieToken} from '../storage/Cookie';
import {requestToken} from '../api/Users';
import {DELETE_TOKEN} from '../store/Auth';


export function CheckToken(key) {
    const [isAuth, setIsAuth] = useState('Loaded');
    const {authenticated} = useSelector(state => state.token);
    const refreshToken = getCookieToken();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuthToken = async () => {
            if (refreshToken === undefined) {
                dispatch(DELETE_TOKEN());
                setIsAuth('Failed');
            } else {
                if (authenticated) {
                    setIsAuth('Success');
                }
            }
        };
        checkAuthToken();
    }, [refreshToken, dispatch, key]);

    return {
        isAuth
    };
}