import { Avatar, Card } from '@mui/material';
import React, { useState } from 'react'
import { Tooltip } from '@mui/material';

const Articles = () => {
    const [articleText, setArticleText] = useState('');

    const handleChange = (e) => {
        setArticleText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Article submitted:', articleText);
    };

    return (
        <div className='flex flex-col justify-center'>
            <div className='w-screen flex flex-col justify-end mt-[3%]'>
                <h1 className='text-4xl font-bold text-center shadow-sm mt-[0%] sm:text-3xl xs:text-2xl'>
                    Who is Me? 
                </h1>
            </div>
            <div className='w-full  mt-[2%]'>
                <div className='mx-auto px-[8%] py-[2%]'>
                    <p className='text-2xl font-semibold text-center xs:text-xl sm:text-xl'>
                       My name is Anas Bouzanbil, I am a software engineer student at 1337school, with a passion for creating and building things, with mastering C and C++ languages, I have a strong foundation in computer science and software engineering. I have experience working with a variety of technologies, including React, Node.js, Express, PostgreSQL and more. I am always looking for new challenges to tackle, and I am currently working as a full-stack developer. I am always looking for new opportunities to learn and grow.
                    </p>
                </div>
            </div>
            <div className='icons flex flex-col gap-y-10 justify-center mt-[2%] w-full'>
                <div className='flex justify-center flex-wrap font-bold text-3xl xs:text-lx sm:text-2xl '>
                    I work with the following technologies:
                </div>
                <div className='flex justify-center gap-[1%]'>
                
                <Tooltip title="C">
                    <Avatar 
                        alt='C'
                        src='https://cdn.iconscout.com/icon/free/png-256/c-programming-569564.png'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>
                <Tooltip title="C++">
                    <Avatar
                        alt='C++'
                        src='https://cdn.iconscout.com/icon/free/png-256/c-4-226082.png'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>


                <Tooltip title="React">
                    <Avatar
                        alt='React'
                        src='https://cdn.iconscout.com/icon/free/png-256/react-1-282599.png'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>
                <Tooltip title="TypeScript">
                    <Avatar
                        alt='TypeScript'
                        src='https://cdn.iconscout.com/icon/free/png-256/typescript-1174965.png'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>
                <Tooltip title="JavaScript">
                    <Avatar
                        alt='JavaScript'
                        src='https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>
                <Tooltip title="NestJS">
                    <Avatar
                        alt='NestJS'
                        src='https://nestjs.com/img/logo-small.svg'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>
                <Tooltip title="PostgreSQL">
                    <Avatar
                        alt='PostgreSQL'
                        src='https://cdn.iconscout.com/icon/free/png-256/postgresql-226047.png'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>
                <Tooltip title="Docker">
                    <Avatar
                        alt='Docker'
                        src='https://cdn.iconscout.com/icon/free/png-256/docker-226091.png'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>
                <Tooltip title="tailwindcss">
                    <Avatar
                        alt='tailwindcss'
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9fZzRj7BuQAtuf6RSuqIjWEaai2Vl7sFq2Y6tKq5hA&s'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>
                <Tooltip title="socket.io">
                    <Avatar
                        alt='socket.io'
                        src='https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/1200px-Socket-io.svg.png'
                        sx={{
                            width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                            transition: 'transform 0.15s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        }}
                    />
                </Tooltip>        
                </div>
                <div className='flex justify-center flex-col gap-y-[30%] mt-[3%]'>
                        <div className='flex justify-center text-wrap font-bold text-2xl xs:text-xl sm:text-xl xs:font-sans'>
                        I am familiar with other technologies as well :
                     </div>
                    <div className='flex flex-row justify-center items-end gap-[0.5%]'>
                    <Tooltip title="Node.js">
                        <Avatar
                            alt='Node.js'
                            src='https://miro.medium.com/v2/resize:fit:800/1*bc9pmTiyKR0WNPka2w3e0Q.png'
                            sx={{
                                width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                                height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                                transition: 'transform 0.15s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.2)',
                                },
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Express">
                        <Avatar
                            alt='Express'
                            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdG9qnL6YBPohLsY-yowMoSV1HQsID8xHc1xqRBj8YUg&s'
                            sx={{
                                width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                                height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                                transition: 'transform 0.15s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.2)',
                                },
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Java">
                        <Avatar
                            alt='Java'
                            src='https://cdn.iconscout.com/icon/free/png-256/java-43-569305.png'
                            sx={{
                                width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                                height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                                transition: 'transform 0.15s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.2)',
                                },
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Python">
                        <Avatar
                            alt='Python'
                            src='https://cdn.iconscout.com/icon/free/png-256/python-2-226051.png'
                            sx={{
                                width: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                                height: { xs: 35, sm: 60, md: 70, lg: 90, xl: 80},
                                transition: 'transform 0.15s ease-in-out',
                                '&:hover': {
                                    transform: 'scale(1.2)',
                                },
                            }}
                        />
                    </Tooltip>
                </div>
                </div>

            </div>
        </div>
    );
};

export default Articles;

