import { useState, useEffect } from "react";
import Loader from "./Loader";
import axios from "axios";
import { useNavigate } from "react-router";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getFlagByNationality } from "../helper/getFlag";
import Flag from "react-flagkit";
import BasicBreadcrumbs from "./BasicBreadcrumbs";

export default function AllTeams(props) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTeams, setFilteredTeams] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getTeams();
    }, [props.year]);

    useEffect(() => {
        const result = teams.filter((item) =>
            item.Constructor.name.toLowerCase().includes(props.search.toLowerCase())
        );

        setFilteredTeams(result);
    }, [teams, props.search]);



    const getTeams = async () => {
        const url = `https://api.jolpi.ca/ergast/f1/${props.year}/constructorStandings.json`;
        const response = await axios.get(url);

        setTeams(response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings);
        setLoading(false);
    };

    if (loading) {
        return <Loader />;
    }

    const crumbs = [
        { label: "Teams", path: "" }
    ];


    return (
        <div className="wrapper">

            <div className="col2" className="results">
                <BasicBreadcrumbs crumbs={crumbs} />
                <h2>CONSTRUCTORS CHAMPIONSHIP - {props.year}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Team</th>
                            <th>Details</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeams.map((team) => {
                            return (
                                <tr key={team.position}>
                                    <td>{team.position}</td>
                                    <td onClick={() => navigate(`/teamDetails/${team.Constructor.constructorId}`)}>
                                        <div className="link">
                                            <Flag country={getFlagByNationality(props.flags,
                                                team.Constructor.nationality)}
                                                size={30} />{team.Constructor.name}
                                        </div>
                                    </td>
                                    <td>Details
                                        <a href={team.Constructor.url} target="_blank"><OpenInNewIcon /></a>
                                    </td>
                                    <td>{team.points}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

