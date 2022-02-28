import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../client.js";
import BlockContent from "@sanity/block-content-to-react";
import SocialMedia from "./SocialMedia.js";
import LoadingSpinner from "./LoadingSpinner.js";
import Button from "./Button.js";
import Footer from "./Footer";

export default function SinglePostNoAuthor() {
  const [singlePost, setSinglePost] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    sanityClient
      .fetch(
        `*[slug.current == "${slug}"]{
      title,
      name,
      role,
      linkedin,
      email,
      profileType,
      id,
      slug,
      mainImage{
        asset->{
          _id,
          url
        }
      },
      body,
    }`
      )
      .then((data) => setSinglePost(data[0]))
      .catch(console.error);
  }, [slug]);

  if (!singlePost) return <LoadingSpinner></LoadingSpinner>;

  const linkedIn = singlePost.linkedin ? (
    <SocialMedia url={singlePost.linkedin} width="35px" height="35px" />
  ) : (
    ""
  );

  const myEmail = singlePost.email ? (
    <SocialMedia
      email="true"
      url={singlePost.email}
      width="35px"
      height="35px"
    />
  ) : (
    ""
  );

  return (
    <main className="bg-white flex flex-col justify-center items-center">
      <section className="container rounded-lg mx-auto p-10 md:p-20 transform duration-500">
        <article className="flex rounded-lg flex-wrap md:flex-nowrap shadow-lg mx-auto">
          <img
            className="w-full md:w-52 h-auto object-cover md:rounded-l-lg"
            src={singlePost.mainImage.asset.url}
            alt={singlePost.name}
          />
          <div className="p-10 my-auto">
            <div className="subtitle text-sm">{singlePost.name}</div>
            <div className="title text-sm pt-2">{singlePost.role}</div>
            <p className="mt-2 body">
              <BlockContent
                blocks={singlePost.body}
                projectId="xvhe4elt"
                dataset="production"
              />
            </p>
            <div className=" flex flex-row">
              <div>{linkedIn}</div>
              <div>{myEmail}</div>
            </div>
          </div>
        </article>
      </section>
      <div className="mb-10">
        {singlePost.profileType === "executive" ? (
          <Button type="local" link="/team" text="Back To Team"></Button>
        ) : (
          <Button
            type="local"
            link="/advisors"
            text="Back To Faculty Advisors"
          ></Button>
        )}
      </div>
      <Footer></Footer>
    </main>
  );
}
