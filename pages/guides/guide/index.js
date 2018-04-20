import React from "react";
import fetch from "isomorphic-fetch";

import MainLayout from "components/MainLayout";
import ContentPagesSidebar from "components/shared/ContentPagesSidebar";
import HeadingRule from "components/shared/HeadingRule";
import BreadcrumbsModule from "shared/BreadcrumbsModule";
import WPEdit from "shared/WPEdit";

import { getMenuItemUrl } from "lib";

import { ABOUT_MENU_ENDPOINT, SEO_TYPE } from "constants/content-pages";

import utils from "stylesheets/utils.scss";
import contentCss from "stylesheets/content-pages.scss";
import css from "stylesheets/guides.scss";

const Guides = ({ url, sidebarItems, breadcrumbs, guide }) =>
  <MainLayout route={url} pageTitle={guide.title} seoType={SEO_TYPE}>
    <BreadcrumbsModule breadcrumbs={breadcrumbs} route={url} />
    <div
      className={`
        ${utils.container}
        ${contentCss.sidebarAndContentWrapper}
      `}
    >
      <div className="row">
        <ContentPagesSidebar
          route={url}
          items={sidebarItems}
          activeItemId={guide.slug}
          className={contentCss.sidebar}
        />
        <div className="col-xs-12 col-md-7">
          <div
            id="main"
            role="main"
            className={[css.content, contentCss.content].join(" ")}
          >
            <WPEdit page={guide} url={url} />
            <img src={guide.bannerImage} alt="" className={css.bannerImage} />
            <h1 className={css.guideTitle}>{guide.title}</h1>
            <HeadingRule />
            <div dangerouslySetInnerHTML={{ __html: guide.content }} />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>;

Guides.getInitialProps = async ({ query }) => {
  const menuItemsRes = await fetch(ABOUT_MENU_ENDPOINT);
  const menuItemsJson = await menuItemsRes.json();
  const guideSlug = query.guide;
  const guide = menuItemsJson.items.find(item => item.post_name === guideSlug);
  const guideRes = await fetch(getMenuItemUrl(guide));
  const guideJson = await guideRes.json();

  let breadcrumbs = [];
  breadcrumbs.push({
    title: "Guides",
    url: "/guides"
  });
  breadcrumbs.push({ title: guideJson.title.rendered });

  return {
    sidebarItems: menuItemsJson.items,
    breadcrumbs: breadcrumbs,
    guide: Object.assign({}, guideJson, {
      slug: guide.url,
      summary: guideJson.acf.summary,
      title: guideJson.title.rendered,
      color: guideJson.acf.color,
      bannerImage: guideJson.acf.banner_image,
      content: guideJson.content.rendered
    })
  };
};

export default Guides;
