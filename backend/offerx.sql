-- Create the user_data table
CREATE TABLE public.profiles (
    id uuid not null references auth.users on delete cascade,
    gender VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_additional_name VARCHAR(255),
    adress VARCHAR(255) NOT NULL,
    plz VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,

    primary key (id)
);

CREATE TABLE public.profiles (
    id uuid not null references auth.users on delete cascade,
    gender VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_additional_name VARCHAR(255),
    adress VARCHAR(255) NOT NULL,
    plz VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    active boolean NOT NULL default true,
    
    primary key (id)
);

-- Create the companys table
CREATE TABLE public.companys (
    id UUID NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) on delete cascade,
    company_name VARCHAR(255) NOT NULL,
    company_additional_name VARCHAR(255),
    adress VARCHAR(255) NOT NULL,
    plz VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(255)
);

-- Create the products table
CREATE TABLE public.products (
    id UUID NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) on delete cascade,
    product_name VARCHAR(255) NOT NULL,
    additional_text VARCHAR(255),
    unit VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    vat VARCHAR(255)
);

-- Create the offers table
CREATE TABLE public.offers (
    id UUID NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES public.profiles(id) on delete cascade,
    company_id uuid NOT NULL REFERENCES public.companys(id) on delete cascade,
    offer_number VARCHAR(255) NOT NULL,
    offer_date date NOT NULL,
    validity VARCHAR(255),
    status VARCHAR(255) NOT NULL,
);

-- Create the offer_has_products table
CREATE TABLE public.offer_has_products (
    id UUID NOT NULL PRIMARY KEY,
    offer_id uuid NOT NULL REFERENCES public.offers(id) on delete cascade,
    product_id uuid NOT NULL REFERENCES public.products(id) on delete cascade,
    amount INTEGER NOT NULL
);
