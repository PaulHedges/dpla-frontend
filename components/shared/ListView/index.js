import React from "react";
import Link from "next/link";

import { joinIfArray, trackClickThrough } from "utilFunctions";
import { truncateString } from "utilFunctions";

import ListImage from "./ListImage";
import { classNames, stylesheet } from "./ListView.css";

const externalLinkIcon = "/static/images/external-link-blue.svg";

/**
 * @param description, item description object
 * @return HTML with truncated item description
 */
const ItemDescription = ({ description }) => {
  let str = joinIfArray(description);
  str = truncateString(str);
  return (
    <div className={classNames.itemDescription}>
      <p>{str}</p>
    </div>
  );
};

const ListView = ({ items, route }) => {
  const handleClickThrough = (e, item) => {
    const gaEvent = {
      type: "Click Through",
      itemId: item.id,
      title: joinIfArray(item.title),
      partner: joinIfArray(item.provider),
      contributor: joinIfArray(item.dataProvider)
    };
    const sourceUrl = item.sourceUrl;
    trackClickThrough(e, gaEvent, sourceUrl);
  };

  const handleBrowseEvent = (e, item) => {
    // Only activate on a browse page
    if (route.pathname.indexOf("/browse-by-topic") === 0) {
      const gaEvent = {
        type: "Browse Item",
        itemId: item.id,
        title: joinIfArray(item.title),
        partner: joinIfArray(item.provider),
        contributor: joinIfArray(item.dataProvider)
      };
      const sourceUrl = item.sourceUrl;
      // Open item page in same page, rather than new page.
      const target = "_self";
      trackClickThrough(e, gaEvent, sourceUrl, target);
    }
  };

  return (
    <ul className={classNames.listView}>
      {items.map(item =>
        <li key={item["@id"] || item.id} className={classNames.listItem}>
          <ListImage
            item={item}
            title={item.title}
            type={item.type}
            url={item.thumbnailUrl}
            useDefaultImage={item.useDefaultImage}
          />
          <div className={classNames.itemInfo}>
            <Link href={item.linkHref} as={item.linkAs}>
              <a className={`classNames.listItemLink internalItemLink`}>
                <h2
                  className={`hover-underline ${classNames.itemTitle}`}
                  onClick={e => handleBrowseEvent(e, item)}
                >
                  {route.pathname.indexOf("/search") === 0 && item.title
                    ? truncateString(item.title, 150)
                    : item.title}
                </h2>
              </a>
            </Link>

            {(item.date || item.creator) &&
              <span className={classNames.itemAuthorAndDate}>
                {route.pathname.indexOf("/search") === 0 &&
                  item.date &&
                  <span>{item.date.displayDate}</span>}
                {route.pathname.indexOf("/search") === 0 &&
                  item.date &&
                  item.date.displayDate &&
                  item.creator &&
                  <span> · </span>}
                <span>{joinIfArray(item.creator, ", ")}</span>
              </span>}
            <ItemDescription description={item.description} />
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover-underline ${classNames.itemSource}`}
              onClick={e => handleClickThrough(e, item)}
            >
              <span className={classNames.itemSourceText}>
                {item.type === "image"
                  ? "View Full Image"
                  : item.type === "text" ? "View Full Text" : "View Full Item"}
              </span>
              <img
                className={classNames.externalLinkIcon}
                src={externalLinkIcon}
                alt=""
              />
            </a>
            {item.dataProvider &&
              <span className={`${classNames.itemProvider}`}>
                &nbsp; in {item.dataProvider}
              </span>}
          </div>
        </li>
      )}
      <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
    </ul>
  );
};

export default ListView;
