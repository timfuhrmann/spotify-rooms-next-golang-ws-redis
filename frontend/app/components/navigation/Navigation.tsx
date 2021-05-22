import React from "react";
import styled from "styled-components";
import { Logo } from "../../icons/Logo";
import Link from "next/link";

const NavigationWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    padding: 3rem 4rem;
`;

const LogoIcon = styled(Logo)`
    color: ${p => p.theme.logo};
    width: 12.5rem;
`;

export const Navigation: React.FC = () => {
    return (
        <NavigationWrapper>
            <Link href="/dashboard">
                <LogoIcon />
            </Link>
        </NavigationWrapper>
    );
};
