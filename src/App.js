// ========================
// 📄 App.js - Weather App UI
// ========================

import "./App.css";

// React
import { useEffect, useState } from "react";

// External
import axios from "axios";
import moment from "moment/moment";
import "moment/min/locales";
import { useTranslation } from "react-i18next";

// MUI Components
import {
  createTheme,
  ThemeProvider,
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useMediaQuery,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";

// Theme
const theme = createTheme({
  typography: { fontFamily: ["Cairo", "sans-serif"].join(",") },
});

let cancelAxios = null;

function App() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("ar");
  const [dateAndTime, setDateAndTime] = useState("");
  const [weather, setWeather] = useState({
    cityName: "",
    description: "",
    temp: null,
    tempMin: null,
    tempMax: null,
    icon: null,
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  // Toggle language
  const handleLangChange = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    i18n.changeLanguage(newLang);
    moment.locale(newLang);
    setDateAndTime(
      moment().format(
        newLang === "ar" ? "dddd | DD / MM / YYYY م" : "dddd | DD / MM / YYYY"
      )
    );
  };

  // Initial language
  useEffect(() => {
    i18n.changeLanguage(lang);
    moment.locale(lang);
    setDateAndTime(
      moment().format(
        lang === "ar" ? "dddd | DD / MM / YYYY م" : "dddd | DD / MM / YYYY"
      )
    );
  }, []);

  // Fetch weather data
  useEffect(() => {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=15.35&lon=44.2&appid=b03a4c84a087c5d71a395412e4439153",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then((response) => {
        const temp = Math.round(response.data.main.temp - 273.15);
        const icon = response.data.weather[0].icon;
        setWeather({
          cityName: response.data.name,
          description: response.data.weather[0].description,
          temp,
          tempMin: Math.round(response.data.main.temp_min - 273.15),
          tempMax: Math.round(response.data.main.temp_max - 273.15),
          icon: `http://openweathermap.org/img/wn/${icon}@2x.png`,
        });
      })
      .catch(console.log);

    return () => cancelAxios();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="sm"
        dir={lang === "ar" ? "rtl" : "ltr"}
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: 2,
        }}
      >
        <Card
          sx={{
            width: "100%",
            borderRadius: 3,
            boxShadow: "0px 11px 10px rgba(0,0,0,0.2)",
            p: 3,
          }}
        >
          <CardContent>
            {/* City & Date */}
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              gap={isMobile ? 1 : 3}
            >
              <Typography variant={isMobile ? "h4" : "h2"}>
                {t(weather.cityName)}
              </Typography>
              <Typography variant={isMobile ? "body1" : "h5"}>
                {dateAndTime}
              </Typography>
            </Box>

            <hr />

            {/* Weather Info */}
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              alignItems="center"
              textAlign={isMobile ? "center" : "right"}
              mt={2}
            >
              {/* Temperature & Description */}
              <Box>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Typography variant={isMobile ? "h3" : "h1"}>
                    {weather.temp}°
                  </Typography>
                  <img src={weather.icon} alt="weather-icon" />
                </Box>

                <Typography
                  className={lang === "en" ? "text-start" : "text-end"}
                  variant={lang === "ar" ? "h4" : "h3"}
                  sx={{ mb: 2 }}
                >
                  {t(weather.description)}
                </Typography>

                {/* Min & Max */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                >
                  <Typography variant="h5">
                    {t("Min")}: {weather.tempMin}
                  </Typography>
                  <Typography variant="h5" color="warning.main">
                    |
                  </Typography>
                  <Typography variant="h5">
                    {t("Max")}: {weather.tempMax}
                  </Typography>
                </Box>
              </Box>

              {/* Cloud Icon */}
              <CloudIcon
                sx={{
                  fontSize: isMobile ? 150 : 200,
                  color: "lightblue",
                  mt: isMobile ? 2 : 0,
                }}
              />
            </Box>

            <hr />

            {/* Language Switch */}
            {/* زر الترجمة والتوقيع */}
            <Box
              textAlign="center"
              mt={3} // مسافة بسيطة من الأعلى
              mb={0} // مسافة خفيفة من الأسفل
            >
              {/* زر تغيير اللغة */}
              <Button
                variant="contained"
                onClick={handleLangChange}
                sx={{
                  borderRadius: "12px",
                  px: 3,
                  py: 1,
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                {lang === "en" ? "Arabic" : "الإنجليزية"}
              </Button>

              {/* توقيع المصمم */}
              <Typography
                variant="body2"
                sx={{
                  mt: 3,
                  fontSize: "1rem",
                  color: "gray",
                  fontWeight: 500,
                  fontFamily: "Cairo, sans-serif",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <span>{t("Designer")}:</span>
                <span style={{ color: "#1976d2", fontWeight: "bold" }}>
                  {t("Mohamed Alssadi")}
                </span>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;
