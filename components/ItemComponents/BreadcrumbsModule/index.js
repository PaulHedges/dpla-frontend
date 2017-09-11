import React from "react";
import { markdown } from "markdown";

import Breadcrumbs from "../../Breadcrumbs";

import { stylesheet, classNames } from "./BreadcrumbsModule.css";
import { classNames as utilClassNames } from "css/utils.css";

const { module } = utilClassNames;

const BreadcrumbsModule = ({ route, breadcrumbs }) =>
  <div className={classNames.wrapper}>
    <div className={[module, classNames.breadcrumbsModule].join(" ")}>
      <Breadcrumbs
        breadcrumbs={breadcrumbs.map(breadcrumb =>
          Object.assign({}, breadcrumb, {
            title: markdown.toHTML(breadcrumb.title)
          })
        )}
      />
    </div>
    <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
  </div>;

export default BreadcrumbsModule;