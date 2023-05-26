import React, {useState, useEffect} from 'react';
import Navbar from './Navbar';

import axios from 'axios';

import {IoMdSunny, 
        IoMdRainy, 
        IoMdCloudy, 
        IoMdSnow, 
        IoMdThunderstorm, 
        IoMdSearch
      } from 'react-icons/io';

import {
  BsCloudHaze2Fill, 
  BsCloudDrizzleFill, 
  BsEye, 
  BsWater, 
  BsThermometer, 
  BsWind
} from 'react-icons/bs';

import {ImSpinner8} from 'react-icons/im';

const APIkey = '3a1b1ef44ae7862451c5cbe977e3e47c';

const WeatherApp = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('New Delhi');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  }

  const handleSubmit = (e) => {
    // if input value is not empty
    if (inputValue !== '') {
      // set location
      setLocation(inputValue);
    }

    // select input
    const input = document.querySelector('input');

    // if input value is empty
    if (inputValue === '') {

      // set animate to true
      setAnimate(true);

      // after 500 ms set animate to false
      setTimeout(()=>{
        setAnimate(false);
      }, 500)
    }


    // clear input
    input.value = '';;

    // prevent defaults
    e.preventDefault();
  }


  useEffect(()=> {

    // set loading to true
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios.get(url).then((res) => {

      // set the data after 1500 ms
      setTimeout(()=> {
        setData(res.data);

        // set loading to false
        setLoading(false);
      }, 1500)
    }).catch(err => {
      setLoading(false);
      setErrorMsg(err);
    }); 
  }, [location]);

  // error message
  useEffect(() => {
    const timer = setTimeout(()=>{
      setErrorMsg('')
    }, 2000)

    // clear timer
    return ()=> clearTimeout(timer);
  }, [errorMsg])

  if (!data) {
    return (
    <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col
    justify-center items-center'>
      <div>
        <ImSpinner8 className='text-5xl animate-spin text-white' />
      </div>
    </div>
    );
  }

  let icon;

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />;
      break;
    case 'Rain':
      icon = <IoMdRainy />;
      break;
    case 'Clear':
      icon = <IoMdSunny />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill />;
      break;
    case 'Snow':
      icon = <IoMdSnow />;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
  }

  // date object
  const date = new Date();

  async function Fetcher(url) {
    const res = await fetch(url);
  
    if (!res.ok) {
      const error = handleError(res.status);
      throw error;
    }
  
    return res.json();
  }
  
  function handleError(errorCode) {
    let error;
    switch (errorCode) {
      case 401:
        error = `It looks like the API did not authorize your request. Please ensure you have a valid API key.`;
        break;
      case 404:
        error = `No results found. Check your query again or try searching for a different location.`;
        break;
      case 429:
        error = `It looks like you've made too many requests to the server. Please wait a while before trying again.`;
        break;
      default:
        error = `Server error`;
        break;
    }
    return new Error(error);
  }

  return(
    <div>
    <Navbar />
    <div className='w-full h-screen bg-[#EDD2E0] bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0'>
    {errorMsg && <div className='w-full max-w-[90vw] lg:max-w-[450px]
    bg-[#000000] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md'>
      {`${errorMsg.response.data.message}`}</div>}

    {/* form */}
    <form className={`${animate ? 'animate-shake' : 'animate-none'} h-16 bg-[#DBABBE] w-full max-w-[450px]
    rounded-full backdrop-blur-[32px] mb-8 text-[#372549]`}>
      <div className='h-full relative flex items-center justify-between p-2'>
        <input onChange={(e) => handleInput(e)}
          className='flex-1 bg-transparent outline-none
          placeholder:text-[#7A52A3] text-[#372549] text-[20px]
          font-normal pl-6 h-full' 
          type="text" 
          placeholder='Search by city or country' 
        />
        <button 
          onClick = {(e) =>  handleSubmit(e)} className='bg-[#372549] hover:bg-[#7A52A3] w-20 h-12
          rounded-full flex justify-center items-center transition'>
          <IoMdSearch className='text-2xl text-white'/>
        </button>
      </div>
    </form>

    {/* card */}
    <div className='w-full max-w-[450px] bg-[#DBABBE] min-h-[584px] 
      text-[#372549] backdrop-blur-[32px] rounded-[32px] py-12 px-6'>
        {loading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <ImSpinner8 className='text-[#EDD2E0] text-5xl animate-spin ' />
          </div>) :      
      (<div>

        {/* card top */}
        <div className='flex items-center gap-x-5'>

          {/* icon */}
          <div className='text-[87px]'>{icon}</div>
          <div>

          {/* country name */}
          <div className='text-2xl font-semibold'>
            {data.name}, {data.sys.country}
          </div>

          {/* date */}
          <div className='text-1l font-normal'>
            {date.getUTCDate()}
            -
            {date.getUTCMonth() + 1}
            -
            {date.getUTCFullYear()}
          </div>
          </div>
        </div>
        <div className='my-20'>
          <div className='flex justify-center items-center'>

            {/* temp */}
            <div className='text-[144px] leading-none font-light'>
              {parseInt(data.main.temp)}°C
            </div>
          </div>

          {/* weather discription */}
          <div className='capitalize text-center'>
            {data.weather[0].description}
          </div>

          {/* High and Low */}
            <div className='capitalize text-center'>
            H:{parseInt(data.main.temp_max)}°C L:{parseInt(data.main.temp_min)}°C            
            </div>
        </div>

        {/* card bottom */}
        <div className='max-w-[378px] mx-auto flex
            flex-col gap-y-6'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-x-2'>

              {/* icon */}
                <div className='text-[20px] font-bold'>
                  <BsEye /> 
                </div>
                <div>
                  Visibility 
                  <span className='ml-2'>{data.visibility/1000} km</span>
                </div>
            </div>

            <div className='flex items-center gap-x-2'>

              {/* icon */}
                <div className='text-[20px]'>
                  <BsThermometer /> 
                </div>
                <div className='flex'>
                  Feels like
                  <div className='flex ml-2'>{parseInt(data.main.feels_like)}</div>°C
                </div>
            </div>
          </div>

          <div className='flex justify-between'>
            <div className='flex items-center gap-x-2'>

              {/* icon */}
                <div className='text-[20px]'>
                  <BsWater /> 
                </div>
                <div>
                  Humidity 
                  <span className='ml-2'>{data.main.humidity} %</span>
                </div>
            </div>
            <div className='flex items-center gap-x-2'>

              {/* icon */}
                <div className='text-[20px]'>
                  <BsWind /> 
                </div>
                <div className='flex'>
                  Wind 
                  <span className='ml-2'>{data.wind.speed} m/s</span>
                </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  </div>
  </div> 
  );
};

export default WeatherApp;
