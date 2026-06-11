import { NavLink, Route, Routes, useLocation } from "react-router";
import Home from "./components/Home";
import AllDrivers from "./components/AllDrivers";
import AllTeams from "./components/AllTeams";
import AllRaces from "./components/AllRaces";
import DriverDetails from "./components/DriverDetails";
import TeamDetails from "./components/TeamDetails";
import RaceDetails from "./components/RaceDetails";
import { useEffect, useState } from "react";
import axios from "axios";
import { grey } from "@mui/material/colors";
import { MdOutlineMenu, MdClose } from "react-icons/md";

export default function App() {
  const [flags, setFlags] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [searchIsVisible, setSearchIsVisible] = useState(false);
  const [selectIsVisible, setSelectIsVisible] = useState(false);
  const [col2IsVisible, setCol2IsVisible] = useState(false);
  const [click, setClick] = useState(true);

  const location = useLocation();

  const Hamburger = <MdOutlineMenu className="HamburgerMenu silver-bg-shadow"
    size="30px" color="black"
    onClick={() => setClick(!click)}
  />

  const Close = <MdClose className="HamburgerMenu silver-bg-shadow"
    size="30px" color="black"
    onClick={() => setClick(!click)} />

  useEffect(() => {
    getFlags();
    getYears();
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setSearchIsVisible(false);
      setSelectIsVisible(false);
      setCol2IsVisible(false);
    } else {
      setSearch("");
      setSearchIsVisible(true);
      setSelectIsVisible(true);
      setCol2IsVisible(true);
    }
  }, [location.pathname]);

  const getFlags = async () => {
    const url = "https://raw.githubusercontent.com/Imagin-io/country-nationality-list/refs/heads/master/countries.json";
    const response = await axios.get(url);
    setFlags(response.data);
  }

  const getYears = () => {
    const years = [];
    let y = new Date().getFullYear();
    for (let i = 0; i < 30; i++) {
      years.push(y--);
    }
    setYears(years);
  }

  return (
    <div className="wrapper">
      <video loop autoPlay muted id="bg-video"
        src={`${import.meta.env.BASE_URL}home-video/clip-race.mp4`}
        type="video/mp4"
        poster={`${import.meta.env.BASE_URL}home-video/video-poster.jpg`}
      >
      </video>
      <div className="col1">
        {click ? Close : Hamburger}
        {click && <nav>
          <div>
            <img className="logo silver-bg-shadow"
              //  src="../img/logo.png" alt="Logo" />
              src="../img/F1-logo.png" alt="Logo" />
          </div>          

          <div className="vNav">
            <ul>
              <NavLink to="/drivers"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""}
              ><li><div className="menuIcons silver-bg-shadow"><img src="../img/Kaciga.png" alt="Drivers logo" />
                <span className="menuText">Drivers</span></div></li></NavLink>
              <NavLink to="/teams" className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""}
              ><li><div className="menuIcons silver-bg-shadow"><img src="../img/Teams.png" alt="Teams logo" />
                <span className="menuText">Teams</span></div></li></NavLink>
              <NavLink to="/races" className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""}
              ><li><div className="menuIcons silver-bg-shadow"><img src="../img/Races1.png" alt="Races logo" />
                <span className="menuText">Races</span></div></li></NavLink>
            </ul>
          </div>
          <div style={selectIsVisible ? { visibility: "visible" } : { visibility: "hidden" }}  >
            <select className="select-search silver-bg-shadow" name="year" id="yearId"
              onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map((year) => {
                return (
                  <option key={year} value={year}>{year}</option>
                );
              })}
            </select>
          </div>
          <div style={searchIsVisible ? { visibility: "visible" } : { visibility: "hidden" }} >
            <input className="select-search silver-bg-shadow" type="search"
              placeholder="Search table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
        </nav>}
      </div>
      <div className={col2IsVisible ? "col2" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drivers" element={<AllDrivers flags={flags} year={selectedYear}
            search={search} />} />
          <Route path="/teams" element={<AllTeams flags={flags} year={selectedYear}
            search={search} />} />
          <Route path="/races" element={<AllRaces flags={flags} year={selectedYear}
            search={search} />} />
          <Route path="/driverDetails/:id" element={<DriverDetails flags={flags} year={selectedYear}
            search={search} />} />
          <Route path="/driverRaces/:id" element={<DriverDetails flags={flags} year={selectedYear}
            search={search} />} />
          <Route path="/teamDetails/:id" element={<TeamDetails flags={flags} year={selectedYear}
            search={search} />} />
          <Route path="/raceDetails/:id" element={<RaceDetails flags={flags} year={selectedYear}
            search={search} />} />
        </Routes>
      </div>
    </div>
  );
}