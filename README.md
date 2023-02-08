# Executive Summary
Neonatal sepsis is blood infection that occurs in infant younger than 90 days old. Neonatal sepsis is one of the biggest cause of deaths in new-borns of which 83% happens in rural area. 

Main objective of this project is to identify key factors which help in assessing the probability of sepsis in neonatal babies before the blood culture report is received. This will help in unnecessary administration of antibiotics in babies. Only the babies with high probability of sepsis will be administered antibiotics and hence reducing antibiotic resistance in babies and further reduce mortality due to the same.

Predicting neonatal sepsis is a challenge which leads to administration of panic antibiotics leading to antibiotic resistance in babies. This project aims in using machine learning algorithms to extract the features which can help in predicting the risk of baby getting sepsis. 

# Approach

In order to train the machine learning algorithm, we've developed a data collection portal (coded in AngularJS). This portal is supported by a nodeJS API backend and finally the data is saved in MySQL database.

Training and predicting the probability of a baby having neonatal sepsis was done using in Python. 

# What you will find in this Repo

In this repository you will the code and also the data models for our solution.

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. For ease of understanding and due to the complex nature of the project, we have broken down our code into various modules. Please see below for the folder structure and their associated modules.

# Folder structure

- 00_Database_Schema - Contains the schema definition
- 01_Web_Portal - Front End code (AngularJS)
- 02_Backend - Backend API code (NodeJS)
- 03_PredictionCode - Code for doing the predictions (batch process).
- 04_PredictionCode_Online - Code for doing the sepsis score prediction via an API.

## License

Avyantra Health Technologies – Presco: Neonatal Predictive Scoring Application and Platform
End-User License Agreement

Copyright© 2019 Avyantra Health Technologies 
All rights reserved

Avyantra Health Technologies – Presco: Neonatal Predictive Scoring Application and Platform

IMPORTANT - READ BEFORE COPYING, INSTALLING OR USING  THIS AVYANTRA SOFTWARE UNTIL YOU HAVE CAREFULLY READ THE FOLLOWING TERMS AND CONDITIONS. BY LOADING OR USING THIS AVYANTRA SOFTWARE, YOU AGREE TO THE TERMS OF THIS AVYANTRA SOFTWARE LICENSE AGREEMENT. IF YOU DO NOT WISH TO AGREE, DO NOT COPY, INSTALL OR USE THIS AVYANTRA SOFTWARE. IF YOU ARE AN AGENT OR EMPLOYEE OF A LEGAL ENTITY YOU REPRESENT AND WARRANT THAT YOU HAVE THE AUTHORITY TO BIND SUCH LEGAL ENTITY TO THIS AGREEMENT. AS USED HEREIN, YOU OR LICENSEE MEANS THE INDIVIDUAL ACCESSING THE SOFTWARE AND HIS/HER EMPLOYER AND AVYANTRA MEANS AVYANTRA HEALTH TECHNOLOGIES
This software is under the terms and conditions of the GNU General Public License as published by the Free Software Foundation : version 2 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the [LICENSE.md](LICENSE.md) file for details.

You should have received a copy of the GNU General Public License along with this program; if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.