// js ======================================== 

const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-B82D3450-BFDA-4C84-8AB7-93D83C67A699&format=JSON`;
const btnAll = document.querySelectorAll('.btn');
const cardRegion = document.querySelector('.card-region');
let origanalData; // 純放拿到的資料
let orgData = {};
const regionAll = [
  ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣'],
  ['基隆市', '新北市', '臺北市', '桃園市', '新竹市', '新竹縣', '苗栗縣'],
  ['臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義市', '嘉義縣'],
  ['臺南市', '高雄市', '屏東縣'],
  ['宜蘭縣', '花蓮縣', '臺東縣'],
  ['澎湖縣', '金門縣', '連江縣']
];
let region = regionAll[0]; // 全部的縣市

// 取得資料
fetchData();
bindBtnAll();

// function ============================ 
function fetchData() {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      origanalData = data;
      
      // 資料處理
      origanizationData();
      // 資料分類
      arrangeCities();
    });
}

// 處理資料
function origanizationData() {
  content = '';

  const locationAll = origanalData.records.location;
  // console.log(locationAll);
  locationAll.forEach(location => {
    // console.log(location);
    // 地區名稱
    const locationName = location.locationName;
    //  取得天氣狀況
    const weatherElement = location.weatherElement[0].time[0];
    let startTime = weatherElement.startTime;

    let endTime = weatherElement.endTime;
    //  天氣狀況
    const wxCondition = weatherElement.parameter.parameterName;
    //天氣狀況對應的圖片代號
    let wxImgCode = weatherElement.parameter.parameterValue;

    if (Number(wxImgCode) < 10) {
      wxImgCode = `0${wxImgCode}`
    }

    // 最高溫 氣溫狀況
    const maxT = location.weatherElement[4].time[0].parameter.parameterName;

    // 物件 {key: keyValue , key: keyValue}
    // 在物件中  新增一個 Key
    //  物件 [key] = {keyValue}
    orgData[locationName] = {
      '天氣狀況(Wx)': wxCondition,
      'WxCode': wxImgCode,
      '開始時間': startTime.replaceAll("-", "/"),
      '結束時間':endTime.replaceAll("-", "/") ,
      '最高溫度(MaxT)': `${maxT}℃`,
    };
  });

  console.log(orgData);
}

// 處理各區域縣市資料
function arrangeCities() {
  content = '';
  region.forEach(city => {
    //找到 key 跟 city 相符的 keyValue;
    const cityDate = orgData[city];
    // console.log(city , cityDate);
    showCard(city, cityDate);
  })
  console.log(content);
  cardRegion.innerHTML = content;
};

function showCard(key, keyValue) {
  content += `
  <div class="card">
  <span class="card-title">${key}</span>
  <hr>
  <span class="img-box">
    <img src="https://www.cwa.gov.tw/V8/assets/img/weather_icons/weathers/svg_icon/day/${keyValue.WxCode}.svg" alt="">
  </span>
  <ul>
    <li>
      <span class="info-title">天氣狀況</span>
      <span class="info-text">${keyValue["天氣狀況(Wx)"]}</span>
    </li>
    <li>
      <span class="info-title">最高溫度</span>
      <span class="info-text">${keyValue["最高溫度(MaxT)"]}</span>
    </li>
    <li>
      <span class="info-title">持續時間</span>
        <span class="info-text">
          <p>${keyValue["開始時間"]}</p>
          <p>&nbsp;到</p>
          <p>${keyValue["結束時間"]}</p>
        </span>
    </li>
  </ul>
  </div>
  `
}

//先指定按鈕的 data ID ，  再分別綁定
function bindBtnAll() {
  for (let i = 0; i < regionAll.length; i++) {
    btnAll[i].dataset.id = i;
  }
  btnAll.forEach(btn => {
    btn.addEventListener('click', () => {
      region = regionAll[btn.dataset.id];
      fetchData();
    });
  });

};

//直接綁定
function bindBtnAll2() {
  for (let i = 0; i < regionAll.length; i++) {
    btnAll[i].addEventListener('click', () => {
      region = regionAll[i];
      fetchData();
    })
  }
};