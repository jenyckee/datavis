# data<-read.dta('Federaal Vlaams_clean.dta')
# df<-head(data, 100)
# library('rmongodb')
# mongo<-mongo.create()

df<-head(data,1000)
flush<-function(r){ 
	mongo.insert(mongo, namespace, mongo.bson.from.list(as.list(r)))
}

insert <-function(df) {
	res<-lapply(split(df, 1:nrow(df)), flush)
}

clean <- function(df) {
	stmts<-apply(df[3:37], 2, function(x){ as.numeric(substr(x,2,2)) })
	cats<-apply(df[39:50], 2, as.numeric)
	stellings<-apply(df[51:85], 2, as.logical)
	cbind(df[1:2],stmts, cats, stellings)
}