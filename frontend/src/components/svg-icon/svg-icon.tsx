import React, {FC} from 'react';
import { ReactComponent as Checkmark } from './../../assets/svgs/checkmark.svg';
import classNames from "classnames";

const iconTypes: any = {
    checkmark: Checkmark,
}

interface SvgIconProps {
    name: string;
    className?: string;
}

// Helper component for using Svg's throughout the file. To add and use a Svg do the following:
//      - Add the svg to the folder public/svgs
//      - Import the svg from that folder at the top of this component
//      - Add the imported svg to the iconTypes object
//      - Use the svg anywhere in the project with the name as a prop: <SvgIcon name="camera" />
const SvgIcon: FC<SvgIconProps> = ({name, className}) => {
    const Icon = iconTypes[name];

    return (
        <Icon className={classNames(className && className)}/>
    );
}

export default SvgIcon;