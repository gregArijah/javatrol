import React, { useState } from "react";
import MyModal from "../../components/modal"
import MyToggle from "../../components/toggle"
import { operations } from "./AppSidebar";
import drillingPoint from "../../pathLogic/drillingPoint";
import drillingLine from "../../pathLogic/drillingLine";
import drillingCircle from "../../pathLogic/drillingCircle";
import drillingArc from "../../pathLogic/drillingArc";






//convert degrees to radians
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

export default function SelectPocket({ isOpen, onClose, selectMainClose }) {
    const [enabled_roughMill, setEnabled_roughMill] = useState(true);
    const [enabled_finishMill, setEnabled_finishMill] = useState("");
    const [enabled_chamferMill, setEnabled_chamferMill] = useState("");

    const INITIAL_STATE = {
        //unit
        pocketDepth: "", stockRemovalZ: "", finishAllowanceZ: "", finishAllowanceR: "", chamferWidth: "",
        //tool
        cuttingDir: "", roughStepDownMode: "", roughStepDown: "", roughStepOver: "", roughToolSpeed: "", roughToolFeed: "",
        roughToolCoolant: "", roughToolNum: "",roughToolDiameter: "", roughStepDownMode: "", roughStepDown: "", finishStepOver: "", finishToolSpeed: "", finishToolFeed: "", 
        finishToolCoolant: "", finishToolNum: "", finishToolDiameter: "", 

                spotToolNum: "", spotToolDepth: "", spotToolFeed: "", spotToolSpeed: "", spotToolCoolant: "",
        centreToolNum: "", centreToolDepth: "", centreToolFeed: "", centreToolSpeed: "", centreToolCoolant: "",
        drillToolNum: "", drillToolAngle: "", drillToolDepth: "", drillToolFeed: "", drillToolSpeed: "", drillToolCoolant: "", drillToolCycle: "",
        chamferToolNum: "", chamferToolAngle: "", chamferToolFeed: "", chamferToolSpeed: "", chamferToolCoolant: "",
        dropdown: "", xPosition: "", yPosition: "", zVal: "", theta: "", spacing: "", spacingMode: "", numberOfHoles: "",
        returnMode: "", radius: "", gCode: "",
    };
    const [formData, setFormData] = useState(INITIAL_STATE);
    

    

    let gCode="34";  //this 34 is for debugging only, delete later

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === "checkbox" ? checked : value;

        //select or deselect included tools
        if ((name === "finishAllowanceR" || name === "finishAllowanceZ")  && (value > 0)) setEnabled_finishMill(true);
        else if (name === "finishAllowanceR" && (value === 0) && !formData.finishAllowanceZ > 0) setEnabled_finishMill(false);
        else if (name === "finishAllowancez" && (value === 0) && !formData.finishAllowanceR > 0) setEnabled_finishMill(false);
        else setEnabled_finishMill(false);
        
        setFormData((formData)=>({
            ...formData, 
            [name]: val,
         
        }));

        console.log(`looking for ${name} and ${val} `);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { value } = e.target;
        if (formData.dropdown === "Square")  gCode = drillingPoint({formData});
        if (formData.dropdown === "Circle")  gCode = drillingLine({formData});
        if (formData.dropdown === "Arbitry")  gCode = drillingCircle({formData});
       
        formData.gCode = gCode;
        //calculate values
        // operations.push({
        //     name:"drill2",
        //     desc:"drill for 1 inch holes",
        //     tool:"1 inch drill",
        //     gCode:"gcode goes here for drilling 1 inch holes"
        //     });
        operations.push({formData});
        console.log(operations);

        setFormData(INITIAL_STATE);

        onClose();
        selectMainClose();

        
    };

    const handleGoBack = (e) => {
        e.preventDefault();
        onClose();
    }

   


    return (
        <MyModal isOpen={isOpen} onClose={onClose}>
            <div className="text-2xl font-medium mb-4">Pocket</div>
            <form className="flex flex-col max-w-fit">
                <div className="flex flex-col max-w-fit">
                    <label htmlFor="pocketDepth">Pocket Depth</label>
                    <input
                        type="number"
                        id="pocketDepth"
                        name="pocketDepth"
                        title="Enter pocket depth: distance from WPC 0 to finish surface"
                        value={formData.pocketDepth}
                        onChange={handleInputChange}
                        className="text-black"
                        min="0"
                        step="any"
                    />
                    <label htmlFor="stockRemovalZ">Stock Removal (Z)</label>
                    <input
                        type="number"
                        id="stockRemovalZ"
                        name="stockRemovalZ"
                        title="Enter stock removal (Z): distance from finish surface to stock surface"
                        value={formData.stockRemovalZ}
                        onChange={handleInputChange}
                        className="text-black"
                        min="0"
                        step="any"
                    />
                    <label htmlFor="finishAllowanceZ"> Finish Allowance (Z)</label>
                    <input
                        type="number"
                        id="finishAllowanceZ"
                        name="finishAllowanceZ"
                        title="Enter finish allowance (Z): floor stock remaining after roughing"
                        value={formData.finishAllowanceZ}
                        onChange={handleInputChange}
                        className="text-black"
                        min="0"
                        step="any"
                    />
                    <label htmlFor="finishAllowanceR"> Finish Allowance (R)</label>
                    <input
                        type="number"
                        id="finishAllowanceR"
                        name="finishAllowanceR"
                        title="Enter finish allowance (R): wall stock remaining after roughing"
                        value={formData.finishAllowanceR}
                        onChange={handleInputChange}
                        className="text-black"
                        min="0"
                        step="any"
                    />
                    {/* <label htmlFor="chamferWidth">Chamfer Width</label>
                    <input
                        type="number"
                        id="chamferWidth"
                        name="chamferWidth"
                        title="Enter chamfer width"
                        value={formData.chamferWidth}
                        onChange={handleInputChange}
                        className="text-black"
                        min="0"
                        step="any"
                    /> */}
                </div>
                <br />
                <div className="flex">
                    <div className="space-y-1">
                        <div className="flex justify-between">Include rough end mill<MyToggle enabled={enabled_roughMill} setEnabled={setEnabled_roughMill} /></div>
                        <div className="flex justify-between">Include finish end mill<MyToggle enabled={enabled_finishMill} setEnabled={setEnabled_finishMill} /></div>
                        <div className="flex justify-between">Include chamfer drill<MyToggle enabled={enabled_chamferMill} setEnabled={setEnabled_chamferMill} /></div>
                    </div>
                    <div>

                        <div className="flex flex-col justify-between space-y-1">
                            <div className={`flex max-w-fit space-x-1 ml-6 ${enabled_roughMill ? '' : 'pointer-events-none opacity-5'}`}>
                                <label htmlFor="roughToolNum"> Tool #</label>
                                <input
                                    type="number"
                                    id="roughToolNum"
                                    name="roughToolNum"
                                    title="Enter roughing end mill tool number"
                                    value={formData.roughToolNum}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                             />
                                <label htmlFor="roughToolDiameter"> Tool Diameter</label>
                                <input
                                    type="number"
                                    id="roughToolDiameter"
                                    name="roughToolDiameter"
                                    title="Enter stock to be removed by spot face tool"
                                    value={formData.roughToolDiameter || 0}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                <label htmlFor="roughStepOver"> Cut Width</label>
                                <input
                                    type="number"
                                    id="roughStepOver"
                                    name="roughStepOver"
                                    title="Enter width of cut for roughing end mill"
                                    value={formData.roughStepOver}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    max="formData.roughToolDiameter"
                                    step="any"
                                />
                                <label htmlFor="roughStepDown"> Cut Depth</label>
                                <input
                                    type="number"
                                    id="roughStepDown"
                                    name="roughStepDown"
                                    title="Enter depth of cut for roughing end mill"
                                    value={formData.roughStepDown}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                 <label htmlFor="roughToolFeed"> Feed Rate</label>
                                <input
                                    type="number"
                                    id="roughToolFeed"
                                    name="roughToolFeed"
                                    title="Enter roughing tool feed rate"
                                    value={formData.roughToolFeed}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                <label htmlFor="roughToolSpeed"> Speed Rate </label>
                                <input
                                    type="number"
                                    id="roughToolSpeed"
                                    name="roughToolSpeed"
                                    title="Enter roughing tool speed rate"
                                    value={formData.roughToolSpeed}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                <label htmlFor="roughToolCoolant"> Coolant</label>
                                <input
                                    type="checkbox"
                                    id="roughToolCoolant"
                                    name="roughToolCoolant"
                                    title="Select if coolant is required"
                                    value={formData.roughToolCoolant}
                                    onChange={handleInputChange}
                                    className="w-4"
                                />
                            </div>
                            <div className={`flex max-w-fit space-x-1 ml-6 ${enabled_finishMill ? '' : 'pointer-events-none opacity-5'}`}>
                                <label htmlFor="finishToolNum"> Tool #</label>
                                <input
                                    type="number"
                                    id="finishToolNum"
                                    name="finishToolNum"
                                    title="Enter finishing end mill tool number"
                                    value={formData.finishToolNum}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                             />
                                <label htmlFor="finishToolDiameter"> Tool Diameter</label>
                                <input
                                    type="number"
                                    id="finishToolDiameter"
                                    name="finishToolDiameter"
                                    title="Enter finishing end mill tool diameter"
                                    value={formData.finishToolDiameter || 0}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                <label htmlFor="finishStepOver"> Cut Width</label>
                                <input
                                    type="number"
                                    id="finishStepOver"
                                    name="finishStepOver"
                                    title="Enter width of cut for roughing end mill"
                                    value={formData.finishStepOver}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    max="formData.finishToolDiameter"
                                    step="any"
                                />
                                <label htmlFor="finishStepDown"> Cut Depth</label>
                                <input
                                    type="number"
                                    id="finishStepDown"
                                    name="finishStepDown"
                                    title="Enter depth of cut for roughing end mill"
                                    value={formData.finishStepDown}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                 <label htmlFor="finishToolFeed"> Feed Rate</label>
                                <input
                                    type="number"
                                    id="finishToolFeed"
                                    name="finishToolFeed"
                                    title="Enter roughing tool feed rate"
                                    value={formData.finishToolFeed}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                <label htmlFor="finishToolSpeed"> Speed Rate </label>
                                <input
                                    type="number"
                                    id="finishToolSpeed"
                                    name="finishToolSpeed"
                                    title="Enter roughing tool speed rate"
                                    value={formData.finishToolSpeed}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                <label htmlFor="finishToolCoolant"> Coolant</label>
                                <input
                                    type="checkbox"
                                    id="finishToolCoolant"
                                    name="finishToolCoolant"
                                    title="Select if coolant is required"
                                    value={formData.finishToolCoolant}
                                    onChange={handleInputChange}
                                    className="w-4"
                                />
                            </div>
                            <div className={`flex max-w-fit space-x-1 ml-6 ${enabled_chamferMill ? '' : 'pointer-events-none opacity-5'}`}>
                                <label htmlFor="drillToolNum"> Tool #</label>
                                <input
                                    type="number"
                                    id="drillToolNum"
                                    name="drillToolNum"
                                    title="Enter drill tool number"
                                    value={formData.drillToolNum}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="0"
                                    step="any"
                                />
                                <label htmlFor="drillToolAngle">Angle</label>
                                <input
                                    type="number"
                                    id="drillToolAngle"
                                    name="drillToolAngle"
                                    title="Enter drill tool angle"
                                    value={formData.drillToolAngle || 118}
                                    onChange={handleInputChange}
                                    className="text-black w-12"
                                    min="90"
                                    max="180"
                                    step="any"
                                />
                                c
                            </div>
                            

                        </div>
                    </div>
                </div>
                <br />
                <div className="flex flex-col space-x-2 space-y-1">
                    <div className="space-x-2">
                        <label htmlFor="dropdown">Select a pocket pattern:</label>
                        <select id="dropdown"
                            type="text"
                            name="dropdown"
                            title="Select a drilling pattern from the following options"
                            onChange={handleInputChange}
                            className="text-black">
                            <option defaultValue="">-- Select an option --</option>
                            <option value="Square"
                                    title="Create a rectangular pocket, square to x&y axis">
                                    Square/Rectangle
                            </option>
                            <option value="Circle"
                                    title="Create a circular pocket, centered on point (x,y)">	
                                    Circle
                            </option>
                            <option value="Arbitrary"
                                    title="Create a pocket with arbitrary shape, defined by a series of points">
                                    Arbitrary</option>
                        </select>
                    </div>
                    <div className={`flex max-w-fit space-x-1 ml-6 ${formData.dropdown === "Point" ? 'block' : 'hidden'}`}>
                        <label htmlFor="zVal"> Z</label>
                        <input
                            type="number"
                            id="zVal"
                            name="zVal"
                            title="Enter Z value of work surface"
                            value={formData.zVal}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="xPosition"> X</label>
                        <input
                            type="number"
                            id="xPosition"
                            name="xPosition"
                            title="Enter X position"
                            value={formData.xPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="yPosition"> Y</label>
                        <input
                            type="number"
                            id="yPosition"
                            name="yPosition"
                            title="Enter Y position"
                            value={formData.yPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="returnMode"> Return </label>
                        <select
                            type="number"
                            id="returnMode"
                            name="returnMode"
                            title="Select return mode"
                            value={formData.returnMode}
                            onChange={handleInputChange}
                            className="text-black w-12">
                            <option defaultValue="">Select</option>
                            <option value="Init">Init</option>
                            <option value="R Point">R Point</option>
                        </select>
                    </div>
                    <div className={`flex max-w-fit space-x-1 ml-6 ${formData.dropdown === "Line" ? 'block' : 'hidden'}`}>
                        <label htmlFor="zVal"> Z</label>
                        <input
                            type="number"
                            id="zVal"
                            name="zVal"
                            title="Enter Z value of work surface"
                            value={formData.zVal}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="xPosition"> X</label>
                        <input
                            type="number"
                            id="xPosition"
                            name="xPosition"
                            title="Enter X position of first hole"
                            value={formData.xPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="yPosition"> Y</label>
                        <input
                            type="number"
                            id="yPosition"
                            name="yPosition"
                            title="Enter Y position of first hole"
                            value={formData.yPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="theta"> Angle θ:</label>
                        <input
                            type="number"
                            id="theta"
                            name="theta"
                            title="Enter angle from X axis"
                            value={formData.theta}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="spacing"> Pitch/Length:</label>
                        <input
                            type="number"
                            id="spacing"
                            name="spacing"
                            title="Enter Pitch between holes or length of line"
                            value={formData.spacing}
                            onChange={handleInputChange}
                            className="text-black w-12"
                            min="0"
                        />
                        <label htmlFor="spacingMode"> </label>
                        <select
                            type="number"
                            id="spacingMode"
                            name="spacingMode"
                            title="Select pitch or length"
                            value={formData.spacingMode}
                            onChange={handleInputChange}
                            className="text-black w-12">
                            <option defaultValue="">Select</option>
                            <option value="Pitch">Pitch</option>
                            <option value="Length">Length</option>
                        </select>
                        <label htmlFor="numberOfHoles"> # of Holes:</label>
                        <input
                            type="number"
                            id="numberOfHoles"
                            name="numberOfHoles"
                            title="Enter the number of holes"
                            value={formData.numberOfHoles}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="returnMode"> Return </label>
                        <select
                            type="number"
                            id="returnMode"
                            name="returnMode"
                            title="Select return mode"
                            value={formData.returnMode}
                            onChange={handleInputChange}
                            className="text-black w-12">
                            <option defaultValue="">Select</option>
                            <option value="Init">Init</option>
                            <option value="R Point">R Point</option>
                        </select>

                    </div>
                    <div className={`flex max-w-fit space-x-1 ml-6 ${formData.dropdown === "Square" ? 'block' : 'hidden'}`}>
                        <label htmlFor="zVal"> Z</label>
                        <input
                            type="number"
                            id="zVal"
                            name="zVal"
                            title="Enter Z value of work surface"
                            value={formData.zVal}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="xPosition"> X</label>
                        <input
                            type="number"
                            id="xPosition"
                            name="xPosition"
                            title="Enter X value"
                            value={formData.xPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="yPosition"> Y</label>
                        <input
                            type="number"
                            id="yPosition"
                            name="yPosition"
                            title="Enter Y value"
                            value={formData.yPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="returnMode"> Return </label>
                        <select
                            type="number"
                            id="returnMode"
                            name="returnMode"
                            title="Select return mode"
                            value={formData.returnMode}
                            onChange={handleInputChange}
                            className="text-black w-12">
                            <option defaultValue="">Select</option>
                            <option value="Init">Init</option>
                            <option value="R Point">R Point</option>
                        </select>
                    </div>
                    <div className={`flex max-w-fit space-x-1 ml-6 ${formData.dropdown === "Grid" ? 'block' : 'hidden'}`}>
                        <label htmlFor="zVal"> Z</label>
                        <input
                            type="number"
                            id="zVal"
                            name="zVal"
                            title="Enter Z value of work surface"
                            value={formData.zVal}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="xPosition"> X</label>
                        <input
                            type="number"
                            id="xPosition"
                            name="xPosition"
                            title="Enter X value"
                            value={formData.xPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="yPosition"> Y</label>
                        <input
                            type="number"
                            id="yPosition"
                            name="yPosition"
                            title="Enter Y value"
                            value={formData.yPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="returnMode"> Return </label>
                        <select
                            type="number"
                            id="returnMode"
                            name="returnMode"
                            title="Select return mode"
                            value={formData.returnMode}
                            onChange={handleInputChange}
                            className="text-black w-12">
                            <option defaultValue="">Select</option>
                            <option value="Init">Init</option>
                            <option value="R Point">R Point</option>
                        </select>
                    </div>
                    <div className={`flex max-w-fit space-x-1 ml-6 ${formData.dropdown === "Circle" ? 'block' : 'hidden'}`}>
                        <label htmlFor="zVal"> Z</label>
                        <input
                            type="number"
                            id="zVal"
                            name="zVal"
                            title="Enter Z value of work surface"
                            value={formData.zVal}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="xPosition"> X</label>
                        <input
                            type="number"
                            id="xPosition"
                            name="xPosition"
                            title="Enter X position of circle center"
                            value={formData.xPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="yPosition"> Y</label>
                        <input
                            type="number"
                            id="yPosition"
                            name="yPosition"
                            title="Enter Y position of circle center"
                            value={formData.yPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="theta"> Angle θ:</label>
                        <input
                            type="number"
                            id="theta"
                            name="theta"
                            title="Enter angle of first hole from X axis"
                            value={formData.theta}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />

                        <label htmlFor="radius"> Radius:</label>
                        <input
                            type="number"
                            id="radius"
                            name="radius"
                            title="Enter bolt circle radius"
                            value={formData.radius}
                            onChange={handleInputChange}
                            className="text-black w-12"
                            min="0"
                        />
                        <label htmlFor="numberOFHoles"> # of Holes:</label>
                        <input
                            type="number"
                            id="numberOfHoles"
                            name="numberOfHoles"
                            title="Enter the number of holes"
                            value={formData.numberOfHoles}
                            onChange={handleInputChange}
                            className="text-black w-12"
                            min="0"
                        />
                        <label htmlFor="returnMode"> Return </label>
                        <select
                            type="number"
                            id="returnMode"
                            name="returnMode"
                            title="Select return mode"
                            value={formData.returnMode}
                            onChange={handleInputChange}
                            className="text-black w-12">
                            <option defaultValue="">Select</option>
                            <option value="Init">Init</option>
                            <option value="R Point">R Point</option>
                        </select>
                    </div>
                    <div className={`flex max-w-fit space-x-1 ml-6 ${formData.dropdown === "Arc" ? 'block' : 'hidden'}`}>
                    <label htmlFor="zVal"> Z</label>
                        <input
                            type="number"
                            id="zVal"
                            name="zVal"
                            title="Enter Z value of work surface"
                            value={formData.zVal}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="xPosition"> X</label>
                        <input
                            type="number"
                            id="xPosition"
                            name="xPosition"
                            title="Enter X position of arc center"
                            value={formData.xPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="yPosition"> Y</label>
                        <input
                            type="number"
                            id="yPosition"
                            name="yPosition"
                            title="Enter Y position of arc center"
                            value={formData.yPosition}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="theta"> Angle θ:</label>
                        <input
                            type="number"
                            id="theta"
                            name="theta"
                            title="Enter angle of first hole from X axis"
                            value={formData.theta}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="spacing"> Angle β :</label>
                        <input
                            type="number"
                            id="spacing"
                            name="spacing"
                            title="Enter total arc angle or angular pitch between holes"
                            value={formData.spacing}
                            onChange={handleInputChange}
                            className="text-black w-12"
                        />
                        <label htmlFor="spacingMode"> </label>
                        <select
                            type="number"
                            id="spacingMode"
                            name="spacingMode"
                            title="Select pitch angle or total arc angle"
                            value={formData.spacingMode}
                            onChange={handleInputChange}
                            className="text-black w-12">
                            <option defaultValue="">Select</option>
                            <option value="Pitch">Pitch</option>
                            <option value="Length">Arc</option>
                        </select>
                        <label htmlFor="radius"> Radius:</label>
                        <input
                            type="number"
                            id="radius"
                            name="radius"
                            title="Enter arc radius"
                            value={formData.radius}
                            onChange={handleInputChange}
                            className="text-black w-12"
                            min="0"
                        />
                        <label htmlFor="numberOFHoles"> # of Holes:</label>
                        <input
                            type="number"
                            id="numberOfHoles"
                            name="numberOfHoles"
                            title="Enter the number of holes"
                            value={formData.numberOfHoles}
                            onChange={handleInputChange}
                            className="text-black w-12"
                            min="0"
                        />
                        <label htmlFor="returnMode"> Return </label>
                        <select
                            type="number"
                            id="returnMode"
                            name="returnMode"
                            title="Select return mode"
                            value={formData.returnMode}
                            onChange={handleInputChange}
                            className="text-black w-12">
                            <option defaultValue="">Select</option>
                            <option value="Init">Init</option>
                            <option value="R Point">R Point</option>
                        </select>

                    </div>
                </div>
                <br />
                <div className="space-x-2 mt-4 flex justify-between">
                    <button onClick={handleSubmit} className="rounded border-2 p-2 px-4 mt-2 bg-gray-950 hover:text-orange-500  hover:border-orange-500">Submit</button>
                    <button onClick={handleGoBack} className="rounded border-2 p-2 px-3 mt-2 bg-gray-950 hover:text-orange-500  hover:border-orange-500">Go Back</button>
                </div>
            </form>
        </MyModal>
    )
}