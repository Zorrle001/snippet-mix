"use client";

type Props = {};

import { SnippetObjType } from "@/components/PopUps/CreateSnippetPopUp";
import { useSnippetStore } from "@/hooks/useSnippetStore";
import Node from "@/node/Node";
import { cn } from "@/utils/Utils";
import { useMemo } from "react";
import styles from "./TableStyles.module.scss";

export default function TablePage({}: Props) {
	const snippets = useSnippetStore((state) => state.snippets);

	const MemorizedNode = useMemo(() => {
		console.log("NODE RENDER");
		return <Node />;
	}, []);

	let i = 0;

	return (
		<>
			{MemorizedNode}
			<article id={styles.tablePage}>
				<section id={styles.leftPart}>
					<nav>
						<i className="fa-solid fa-angle-left"></i>
						<h1>SHOW #3</h1>
					</nav>
					<ul>
						{snippets.map((snp) => {
							i++;
							return (
								<SnippetListItem
									snippetObj={snp}
									linked={i > 1 && i < 4 ? true : false}
								/>
							);
						})}
					</ul>
				</section>
				<section id={styles.rightPart}>
					<nav>
						<button>
							<i className="fa-solid fa-play"></i>
							<i className="fa-solid fa-angle-left"></i>
							<p>Go Prev</p>
						</button>
						<button>
							<i className="fa-solid fa-play"></i>
							<i className="fa-solid fa-angle-right"></i>
							<p>Go Next</p>
						</button>
						<button>
							<i className="fa-solid fa-angle-left"></i>
							<p>Prev</p>
						</button>
						<button>
							<i className="fa-solid fa-angle-right"></i>
							<p>Next</p>
						</button>
						<button>
							<i className="fa-solid fa-play"></i>
							<p>Go</p>
						</button>
					</nav>
					<div>
						<h3>
							Snippet Creation{" "}
							<span id={styles.parameters}>- 1 Parameter</span>
						</h3>

						<div>
							<button>
								<i className="fa-solid fa-bars-progress"></i>
								<p>Scope</p>
							</button>
							<button>
								<i className="fa-regular fa-pen-to-square"></i>
								<p>Params</p>
							</button>
							<button className={styles.save}>
								<i className="fa-regular fa-floppy-disk"></i>
								<p>Save</p>
							</button>
						</div>
						<div>
							<button>
								<i className="fa-solid fa-circle"></i>
								<p>Rec</p>
							</button>

							<button className={styles.recScope}>
								<i className="fa-solid fa-circle"></i>
								<i className="fa-solid fa-bars-progress"></i>
								<p>Rec Scope</p>
							</button>
							<button className={styles.trash}>
								<i className="fa-regular fa-trash-can"></i>
								<p>Clear</p>
							</button>
						</div>
					</div>
				</section>
			</article>
		</>
	);
}

function SnippetListItem({
	snippetObj,
	linked,
}: {
	snippetObj: SnippetObjType;
	linked?: boolean;
}) {
	return (
		<li
			className={cn(
				styles.snippetListItem,
				linked === true ? styles.linked : ""
			)}
		>
			<i className={"fa-solid fa-play " + styles.linkedIcon}></i>
			<i
				className={cn(
					snippetObj.snippetIcon,
					styles[snippetObj.snippetColor[1]]
				)}
			></i>
			<p>{snippetObj.snippetName}</p>
			<p className={styles.label}>SNIP</p>
		</li>
	);
}
