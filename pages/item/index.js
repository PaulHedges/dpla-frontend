import React from "react";
import fetch from "isomorphic-fetch";

import Error from "pages/_error";
import MainLayout from "components/MainLayout";
import CiteButton from "components/shared/CiteButton";
import BreadcrumbsModule from "components/ItemComponents/BreadcrumbsModule";
import Content from "components/ItemComponents/Content";
import { CheckableLists } from "components/ListComponents/CheckableLists";

import { API_ENDPOINT, THUMBNAIL_ENDPOINT } from "constants/items";

import {
  getCurrentUrl,
  getCurrentFullUrl,
  joinIfArray,
  getDefaultThumbnail
} from "lib";

import {
  DEFAULT_PAGE_SIZE,
  possibleFacets,
  mapFacetsToURLPrettified,
  splitAndURIEncodeFacet
} from "constants/search";

import utils from "stylesheets/utils.scss";
import css from "components/ItemComponents/itemComponent.scss";

const ItemDetail = ({
  error,
  url,
  item,
  currentFullUrl
  // paginationInfo,
  // searchItemCount
}) => {
  if (error) {
    return <Error statusCode={error.statusCode} />;
  }
  return (
    <MainLayout
      route={url}
      pageTitle={item.title}
      pageImage={item.thumbnailUrl}
    >
      <BreadcrumbsModule /* searchItemCount={searchItemCount} */
        /* paginationInfo={paginationInfo} */
        breadcrumbs={[
          {
            title: "All items",
            url: {
              pathname: "/search"
            }
          },
          { title: joinIfArray(item.title), search: "" }
        ]}
        route={url}
      />
      <div
        id="main"
        role="main"
        className={`${utils.container} ${css.contentWrapper}`}
      >
        <Content item={item} url={url} />
        <div className={css.faveAndCiteButtons}>
          <CiteButton
            creator={item.creator}
            displayDate={item.date ? item.date.displayDate : item.date}
            spatialName={item.spatial ? item.spatial.name : item.spatial}
            sourceUrl={item.sourceUrl}
            className={css.citeButton}
            toCiteText="item"
            title={item.title}
          />
          <CheckableLists itemId={item.id} />
        </div>
      </div>

    </MainLayout>
  );
};

ItemDetail.getInitialProps = async ({ query, req, res }) => {
  const currentFullUrl = getCurrentFullUrl(req);
  const currentUrl = getCurrentUrl(req);

  // check if item is found
  try {
    const res = await fetch(`${currentUrl}${API_ENDPOINT}/${query.itemId}`);
    const json = await res.json();

    const doc = json.docs[0];
    const thumbnailUrl = doc.object
      ? `${currentUrl}${THUMBNAIL_ENDPOINT}/${doc.id}`
      : getDefaultThumbnail(doc.sourceResource.type);
    const date = doc.sourceResource.date &&
      Array.isArray(doc.sourceResource.date)
      ? doc.sourceResource.date[0]
      : doc.sourceResource.date;
    const language = doc.sourceResource.language &&
      Array.isArray(doc.sourceResource.language)
      ? doc.sourceResource.language.map(lang => {
          return lang.name;
        })
      : doc.sourceResource.language;

    // set up search API calls for previous/next items in the current search.
    // a lot of this is copied from `/search`'s getInitialProps, so could be
    // refactored
    // const page_size =
    //   parseInt(query.page_size, 10) || parseInt(DEFAULT_PAGE_SIZE, 10);
    // const page = parseInt(query.page, 10) || 1;
    // const q = query.q;
    // let previousItemPage = page;
    // let nextItemPage = page;
    // let previousItemId;
    // let nextItemId;
    // let searchItemCount;

    // if (query.next || query.previous) {
    //   let sort_by = "";
    //   if (query.sort_by === "title") {
    //     sort_by = "sourceResource.title";
    //   } else if (query.sort_by === "created") {
    //     sort_by = "sourceResource.date.begin";
    //   }
    //   const sort_order = query.sort_order || "";

    //   const facetQueries = possibleFacets
    //     .map(
    //       facet =>
    //         query[mapFacetsToURLPrettified[facet]]
    //           ? `${facet}=${splitAndURIEncodeFacet(
    //               query[mapFacetsToURLPrettified[facet]]
    //             )}`
    //           : ""
    //     )
    //     .filter(facetQuery => facetQuery !== "")
    //     .join("&");

    //   let currentPage = page;
    //   // in this case, the previous item is the last item on the current page,
    //   // so we increment the page number
    //   if (query.previous > 0 && query.previous % page_size === 0) {
    //     currentPage = page + 1;
    //   }

    //   // make a request for the current page of search results
    //   const searchRes = await fetch(
    //     `${currentUrl}${API_ENDPOINT}?q=${q}&page=${currentPage}&page_size=${page_size}&sort_order=${sort_order}&sort_by=${sort_by}&facets=${possibleFacets.join(
    //       ","
    //     )}&${facetQueries}`
    //   );
    //   const searchJson = await searchRes.json();
    //   searchItemCount = searchJson.count;

    //   const nextItemIdx = query.next && query.next % page_size;
    //   // make a request for the next page of search results if next item is
    //   // not on the current page
    //   if (
    //     query.next > page * page_size - 1 &&
    //     searchItemCount > page * page_size
    //   ) {
    //     nextItemPage = page + 1;
    //     const nextPageRes = await fetch(
    //       `${currentUrl}${API_ENDPOINT}?q=${q}&page=${nextItemPage}&page_size=${page_size}&sort_order=${sort_order}&sort_by=${sort_by}&facets=${possibleFacets.join(
    //         ","
    //       )}&${facetQueries}`
    //     );
    //     const nextPageJson = await nextPageRes.json();
    //     nextItemId = nextPageJson.docs[nextItemIdx].id;
    //   } else {
    //     nextItemId = query.next ? searchJson.docs[nextItemIdx].id : "";
    //   }

    //   const previousItemIdx = query.previous % page_size;
    //   // make a request for the previous page of search results if previous item is
    //   // not on the current page
    //   if (query.previous < (page - 1) * page_size && page - 1 > 0) {
    //     previousItemPage = page - 1;
    //     const previousPageRes = await fetch(
    //       `${currentUrl}${API_ENDPOINT}?q=${q}&page=${previousItemPage}&page_size=${page_size}&sort_order=${sort_order}&sort_by=${sort_by}&facets=${possibleFacets.join(
    //         ","
    //       )}&${facetQueries}`
    //     );
    //     const previousPageJson = await previousPageRes.json();
    //     previousItemId = previousPageJson.docs[previousItemIdx].id;
    //   } else {
    //     previousItemId = query.previous >= 0
    //       ? searchJson.docs[previousItemIdx].id
    //       : "";
    //   }
    // }

    return {
      currentFullUrl,
      // paginationInfo: {
      //   next: {
      //     id: nextItemId,
      //     page: nextItemPage
      //   },
      //   previous: {
      //     id: previousItemId,
      //     page: previousItemPage
      //   }
      // },
      // searchItemCount,
      item: Object.assign({}, doc.sourceResource, {
        id: doc.id,
        thumbnailUrl,
        contributor: doc.dataProvider,
        intermediateProvider: doc.intermediateProvider,
        date: date,
        language: language,
        partner: doc.provider.name,
        sourceUrl: doc.isShownAt,
        useDefaultImage: !doc.object,
        edmRights: doc.rights
      })
    };
  } catch (error) {
    if (res) {
      res.statusCode = 404;
    }
    return { error: { statusCode: 404 } };
  }
};
export default ItemDetail;
