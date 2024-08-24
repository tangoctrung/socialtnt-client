import { Context } from 'context/Context';
import React from 'react';
import { useContext } from 'react';
import HomePageContent from '../../components/HomePageContent/HomePageContent';
import Leftbar from '../../components/Leftbar/Leftbar';
import Rightbar from '../../components/Rightbar/Rightbar';
import "./HomePage.css";
function HomePage() {

    return (
        <div className="homePage">
            <div className="homePage-content">
                <div className="homePage-left">
                    <Leftbar />
                </div>
                <div className="homePage-center">
                    <HomePageContent />
                </div>
                <div className="homePage-right">
                    <Rightbar />
                </div>
            </div>
        </div>
    );
}

export default HomePage;